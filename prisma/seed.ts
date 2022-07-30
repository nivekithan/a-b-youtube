import {
  SeedAccounts,
  seedThumbnailJob,
  seedThumbnailResult,
  seedThumbnails,
  SeedUsers,
} from "seedData/data";
import { prisma } from "~/db.server";

const seed = async () => {
  const users = Object.values(SeedUsers);
  await prisma.user.createMany({ data: users });

  const accounts = Object.values(SeedAccounts).flat();
  await prisma.youtubeAccount.createMany({ data: accounts });

  const thumbnailJobs = Object.values(seedThumbnailJob).flat();
  await prisma.thumbnailJob.createMany({ data: thumbnailJobs });

  const thumbnails = Object.values(seedThumbnails).flat();
  await prisma.thumbnails.createMany({ data: thumbnails });

  const thumbnailsResult = Object.values(seedThumbnailResult).flat();
  await prisma.thumbnailResult.createMany({ data: thumbnailsResult });
};

seed();
