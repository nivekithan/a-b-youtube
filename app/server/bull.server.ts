import type { QueueOptions } from "bullmq";
import { QueueScheduler } from "bullmq";
import { Queue, Worker } from "bullmq";
import { sub } from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { prisma } from "~/db.server";
import { setAbTestResult } from "~/models/abTest.server";
import { changeThumbnail } from "~/models/videos.server";
import { getEnvVar } from "./utils.server";

const thumbnailQueueName = "thumbanilQueue";

const redisConnectionOptions: QueueOptions["connection"] = {
  host: getEnvVar("REDIS_HOST"),
  password: getEnvVar("REDIS_PASSWORD"),
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

    if (totalNumberOfThumbails === 0) {
      return null;
    }

    const changeToThumbnail =
      thumbnailJob.thumbnails[currentDay % totalNumberOfThumbails];

    await changeThumbnail({
      account: thumbnailJob.youtubeAccount,
      thumbnail: changeToThumbnail,
      thumbnailJob: thumbnailJob,
    });

    if (currentDay !== 0) {
      const previousDay = currentDay - 1;
      const previousThumbnail =
        thumbnailJob.thumbnails[previousDay % totalNumberOfThumbails];

      const currentDate = new Date();
      const yesterday = sub(currentDate, { days: 1 });
      const yesterdayInPST = utcToZonedTime(yesterday, "America/Los_Angeles");

      const formatedDate = formatInTimeZone(
        yesterdayInPST,
        "America/Los_Angeles",
        "yyyy-MM-dd"
      );

      await setAbTestResult({
        thumbnailJob,
        date: formatedDate,
        thumbnail: previousThumbnail,
        youtubeAccount: thumbnailJob.youtubeAccount,
      });
    }

    return "Success";
  },
  { connection: redisConnectionOptions }
);

new QueueScheduler(thumbnailQueueName, {
  connection: redisConnectionOptions,
});
