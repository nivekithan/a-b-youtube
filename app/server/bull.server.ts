import type { QueueOptions } from "bullmq";
import { QueueScheduler } from "bullmq";
import { Queue, Worker } from "bullmq";
import { prisma } from "~/db.server";
import { changeThumbnail } from "~/models/videos.server";
import { getEnvVar } from "./utils.server";

const thumbnailQueueName = "thumbanilQueue";

const redisConnectionOptions: QueueOptions["connection"] = {
  host: getEnvVar("REDIS_HOST"),
};

export const ThumbnailQueue = new Queue<{ id: string }>(thumbnailQueueName, {
  connection: redisConnectionOptions,
});

export const ThumbnailWorker = new Worker<{ id: string }, null | string>(
  thumbnailQueueName,
  async (job) => {
    const jobId = job.data.id;

    const thumbnailJob = await prisma.thumbnailJob.findUnique({
      where: { jobId: jobId },
      include: { thumbnails: true, youtubeAccount: true },
    });

    if (thumbnailJob === null) {
      return null;
    }

    const currentDay = thumbnailJob.currentDay;
    const totalNumberOfThumbails = thumbnailJob.thumbnails.length;
    const changeToThumbnail =
      thumbnailJob.thumbnails[currentDay % totalNumberOfThumbails];

    await changeThumbnail({
      account: thumbnailJob.youtubeAccount,
      thumbnail: changeToThumbnail,
      thumbnailJob: thumbnailJob,
    });
    return "Success";
  },
  { connection: redisConnectionOptions }
);

new QueueScheduler(thumbnailQueueName, {
  connection: redisConnectionOptions,
});
