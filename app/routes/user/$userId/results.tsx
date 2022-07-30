import type { ThumbnailJob } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { Results } from "~/components/results";
import { prisma } from "~/db.server";
import { requireUserId } from "~/models/user.server";

const ZLoaderSchema = z.object({
  results: z.array(
    z.object({
      title: z.string(),
      img: z.string(),
      daysLeft: z.number(),
      jobId: z.string(),
    })
  ),
});

const normalizeThumbnailJob = (
  thumbnailJob: ThumbnailJob
): RouteLoaderData["results"][number] => {
  const videoTitle = thumbnailJob.videoName;
  const originalThumbnailUrl = thumbnailJob.thumbnailUrl;
  const jobId = thumbnailJob.jobId;
  const daysLeft = thumbnailJob.testDays - thumbnailJob.currentDay;

  return { daysLeft, img: originalThumbnailUrl, jobId, title: videoTitle };
};

type RouteLoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");

  const allYoutubeTest = await prisma.thumbnailJob.findMany({
    where: { user: { userId: userId } },
    orderBy: { updatedAt: "desc" },
  });

  const normalizedResults = allYoutubeTest.map(normalizeThumbnailJob);

  return json<RouteLoaderData>({ results: normalizedResults });
};

const useZLoaderData = () => {
  const data = useLoaderData();
  return ZLoaderSchema.parse(data);
};

export default function RenderResults() {
  const loaderData = useZLoaderData();

  return <Results results={loaderData.results} />;
}
