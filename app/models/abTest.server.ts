import { z } from "zod";
import { prisma } from "~/db.server";
import { ThumbnailQueue } from "~/server/bull.server";
import { badRequest } from "~/server/utils.server";
import { getChannelIdOfVideo } from "./videos.server";

export type CreateAbTestArgs = {
  formData: FormData;
  userId: string;
};

export const createAbtest = async ({ formData, userId }: CreateAbTestArgs) => {
  const stringifiedThumbnails = formData.getAll("thumbnails");

  if (stringifiedThumbnails.length > 3) {
    return badRequest("Too many thumbnails");
  }

  const parsedThumbnails = stringifiedThumbnails.map((thumbnailInStr) => {
    if (!thumbnailInStr || typeof thumbnailInStr !== "string") {
      throw badRequest("Thumbnails is required");
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

  const videoUrl = formData.get("videoUrl");
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
};
