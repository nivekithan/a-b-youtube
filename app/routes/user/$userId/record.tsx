import type { ThumbnailResult } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { ClickGraphProps, VideoRecord } from "~/components/videoRecord";
import { prisma } from "~/db.server";
import { requireUserId } from "~/models/user.server";
import { format } from "date-fns";

const ZRouteLoaderSchema = z.object({
  results: z.array(
    z.object({
      thumbnailId: z.string(),
      thumbnailResultId: z.string(),
      clickThroughRate: z.number(),
      averageViewDuration: z.number(),
      date: z.string(),
      img: z.string(),
    })
  ),
  videoTitle: z.union([z.string(), z.null()]),
});

type RouteLoaderData = z.infer<typeof ZRouteLoaderSchema>;

const normalizeThumbnailResult = (
  result: ThumbnailResult,
  thumbnailFileId: string
): RouteLoaderData["results"][number] => {
  return {
    clickThroughRate: result.clickThroughRate,
    averageViewDuration: result.averageViewDuration,
    date: result.createdAt.toISOString(),
    img: `/api/v1/file/${thumbnailFileId}`,
    // img: "https://images.unsplash.com/photo-1658901742285-a5cba478b576?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=918&q=80",
    thumbnailId: result.thumbnailId,
    thumbnailResultId: `${result.id}`,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return redirect(`/user/${userId}/results`);
  }

  const thumbnailJob = await prisma.thumbnailResult.findMany({
    where: { jobId: jobId },
    orderBy: { createdAt: "desc" },
    include: {
      thumbnail: {
        select: { fileId: true, job: { select: { videoName: true } } },
      },
    },
  });

  const thumbnailResult = thumbnailJob.map((res) => {
    const normalizedThumbnailResult = normalizeThumbnailResult(
      res,
      res.thumbnail.fileId
    );

    return normalizedThumbnailResult;
  });

  const isNoThumbnailFound = thumbnailResult.length === 0;
  const videoTitle = isNoThumbnailFound
    ? null
    : thumbnailJob[0].thumbnail.job.videoName;

  return json<RouteLoaderData>({
    results: thumbnailResult,
    videoTitle: videoTitle,
  });
};

const useZLoaderData = () => {
  const data = useLoaderData();
  return ZRouteLoaderSchema.parse(data);
};

export default function RenderVideoRecord() {
  const loaderData = useZLoaderData();

  const thumbnailMap = new Map<string, number>();

  let maxThumbnailScore = 0;
  let bestThumbnailResult = null as null | RouteLoaderData["results"][number];

  let totalScore = 0;
  const clickGraphData: ClickGraphProps["data"] = [];

  const thumbnailsWithFormatedDate = loaderData.results.map((res) => {
    const withFormatedDate = {
      ...res,
      date: format(new Date(res.date), "do LLLL yyyy"),
    };

    const score = res.clickThroughRate * res.averageViewDuration;
    totalScore += score;
    clickGraphData.unshift({
      date: format(new Date(res.date), "do LLLL"),
      id: withFormatedDate.thumbnailId,
      score,
    });

    if (thumbnailMap.has(res.thumbnailId)) {
      const value = thumbnailMap.get(res.thumbnailId)!;

      const newScore = value + score;
      thumbnailMap.set(res.thumbnailId, newScore);
      if (newScore > maxThumbnailScore) {
        maxThumbnailScore = newScore;
        bestThumbnailResult = { ...withFormatedDate };
      }
    } else {
      const newValue = score;
      thumbnailMap.set(res.thumbnailId, newValue);

      if (newValue > maxThumbnailScore) {
        maxThumbnailScore = newValue;
        bestThumbnailResult = { ...withFormatedDate };
      }
    }

    return withFormatedDate;
  });

  const average =
    totalScore !== 0 ? totalScore / thumbnailsWithFormatedDate.length : 0;

  // console.log(loaderData.jobId);
  return (
    <VideoRecord
      timelineProps={{
        average: average,
        videoName: loaderData.videoTitle,
        thumbnailsData: thumbnailsWithFormatedDate,
      }}
      bestThumbnailProps={
        bestThumbnailResult === null
          ? { type: "notAvaliable" }
          : { type: "avaliable", ...bestThumbnailResult }
      }
      clickGraphProps={{
        data: clickGraphData,
        maxScore: maxThumbnailScore,
      }}
    />
  );
}
