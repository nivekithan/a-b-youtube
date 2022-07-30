import type { ThumbnailJob, Thumbnails, YoutubeAccount } from "@prisma/client";
import { json } from "@remix-run/server-runtime";
import { google } from "googleapis";
import { z } from "zod";
import { prisma } from "~/db.server";
import { ThumbnailQueue } from "~/server/bull.server";
import { badRequest } from "~/server/utils.server";
import { getGoogleOAuthClient } from "./google.server";
import { getChannelIdOfVideo } from "./videos.server";
import { ifNeededRefreshToken } from "./youtubeAccount.server";

export type CreateAbTestArgs = {
  formData: FormData;
  userId: string;
};

export const createAbtest = async ({ formData, userId }: CreateAbTestArgs) => {
  const stringifiedThumbnails = formData.getAll("thumbnails");


  console.log(stringifiedThumbnails);
  if (stringifiedThumbnails.length === 0) {
    return badRequest("No thumbnails selected");
  }

  const parsedThumbnails = stringifiedThumbnails.map((thumbnailInStr) => {
    console.log(thumbnailInStr);

    if (!thumbnailInStr || typeof thumbnailInStr !== "string") {
      throw new Error("Unreachable");
    }

    const ZThumbnailSchema = z.object({
      id: z.string(),
      contentType: z.string(),
    });

    const thumbnails = ZThumbnailSchema.parse(JSON.parse(thumbnailInStr));

    return thumbnails;
  });

  if (parsedThumbnails.length <= 0) {
    return badRequest("Thumbnails is required");
  }

  const videoUrl = formData.get("videoLink");
  const testDaysInStr = formData.get("testDays");

  if (!videoUrl || typeof videoUrl !== "string") {
    return badRequest("Video url is required");
  }

  if (!testDaysInStr || typeof testDaysInStr !== "string") {
    return badRequest("Test days is required");
  }

  const testDays = parseInt(testDaysInStr, 10);

  if (Number.isNaN(testDays)) {
    return badRequest("Test days must be a number");
  }

  const url = new URL(videoUrl);

  const urlSearchParams = url.searchParams;
  const videoId = urlSearchParams.get("v");

  if (!videoId) {
    return badRequest("Choose a valid youtube video");
  }

  const videoChannelId = await getChannelIdOfVideo(videoId);

  if (!videoChannelId) {
    return badRequest("Choose a valid youtube video");
  }

  const youtubeAccount = await prisma.youtubeAccount.findUnique({
    where: {
      userId_channelId: { channelId: videoChannelId, userId: userId },
    },
  });

  if (youtubeAccount === null) {
    return badRequest("Chosen video is not connected to any of your account");
  }

  const thumbnailJob = await prisma.thumbnailJob.create({
    data: {
      videoId: videoId,
      testDays: testDays,
      currentDay: 0,
      youtubeAccount: {
        connect: {
          accountId: youtubeAccount.accountId,
        },
      },
      user: { connect: { userId: userId } },
      thumbnails: {
        createMany: {
          data: parsedThumbnails.map((thumbnail) => {
            return {
              fileId: thumbnail.id,
              videoId: videoId,
              userId: userId,
              contentType: thumbnail.contentType,
            };
          }),
        },
      },
    },
  });

  const id = thumbnailJob.jobId;

  await ThumbnailQueue.add(
    `ThumbnailJob`,
    { id: id },
    {
      repeat: {
        every: 1000 * 60 * 60 * 24,
        limit: thumbnailJob.testDays,
      },
    }
  );

  return json({ jobId: id });
};

export type GetAbTestResultArgs = {
  thumbnailJob: ThumbnailJob;
  youtubeAccount: YoutubeAccount;
  thumbnail: Thumbnails;
  date: string;
};

export const setAbTestResult = async ({
  thumbnailJob,
  youtubeAccount,
  thumbnail,
  date,
}: GetAbTestResultArgs) => {
  try {
    await ifNeededRefreshToken(youtubeAccount);

    const googleAuthClient = getGoogleOAuthClient();

    googleAuthClient.setCredentials({
      access_token: youtubeAccount.oauthToken,
    });

    const apiResult = await google.youtubeAnalytics("v2").reports.query({
      auth: googleAuthClient,
      dimensions: "day",
      metrics: "annotationClickThroughRate,averageViewDuration",
      startDate: date,
      endDate: date,
      ids: `channel=${youtubeAccount.channelId}`,
      filters: `video=${thumbnailJob.videoId}`,
    });

    if (apiResult.data.errors) {
      return setAbResultForThumbnail({
        thumbnail,
        averageViewDuration: 0,
        clickThroughRate: 0,
        date: new Date(date),
      });
    }

    const headerRow = apiResult.data.columnHeaders;
    const firstRow = apiResult.data.rows?.[0];

    if (
      firstRow === undefined ||
      firstRow.length === 0 ||
      headerRow === undefined
    ) {
      return setAbResultForThumbnail({
        thumbnail,
        averageViewDuration: 0,
        clickThroughRate: 0,
        date: new Date(date),
      });
    }

    const parsedTestData = retriveAbTestResult(headerRow, firstRow);

    return setAbResultForThumbnail({
      date: new Date(date),
      thumbnail,
      averageViewDuration: parsedTestData.averageViewDuration,
      clickThroughRate: parsedTestData.clickThroughRate,
    });
  } catch (err) {
    setAbResultForThumbnail({
      averageViewDuration: 0,
      clickThroughRate: 0,
      date: new Date(date),
      thumbnail,
    });
  }
};

const retriveAbTestResult = (
  headers: { name?: string | undefined | null }[],
  row: unknown[]
) => {
  const result: { clickThroughRate: number; averageViewDuration: number } = {
    clickThroughRate: 0,
    averageViewDuration: 0,
  };

  headers.forEach((header, i) => {
    if (header.name === "annotationClickThroughRate") {
      const headerResult = row[i];
      const clickThroughRate = z.number().safeParse(headerResult);
      if (clickThroughRate.success) {
        result.clickThroughRate = clickThroughRate.data;
      }
    } else if (header.name === "averageViewDuration") {
      const headerResult = row[i];
      const averageViewDuration = z.number().safeParse(headerResult);
      if (averageViewDuration.success) {
        result.averageViewDuration = averageViewDuration.data;
      }
    }
  });

  return result;
};

export type SetResultForThumbnailArgs = {
  thumbnail: Thumbnails;
  clickThroughRate: number;
  averageViewDuration: number;
  date: Date;
};

const setAbResultForThumbnail = async ({
  averageViewDuration,
  clickThroughRate,
  thumbnail,
  date,
}: SetResultForThumbnailArgs) => {
  try {
    await prisma.thumbnailResult.create({
      data: {
        averageViewDuration: averageViewDuration,
        clickThroughRate: clickThroughRate,
        thumbnail: { connect: { fileId: thumbnail.fileId } },
        at: date,
      },
    });
  } catch (err) {
    console.error(err);
    return;
  }
};

export const getAbResultForJob = async (thumbnailJob: ThumbnailJob) => {
  return prisma.thumbnails.findMany({
    where: { jobId: thumbnailJob.jobId },
    include: { result: true },
  });
};
