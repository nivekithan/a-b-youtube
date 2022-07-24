import { SeedAccounts, SeedUsers } from "seedData/data";
import { prisma } from "~/db.server";

const seed = async () => {
  const users = Object.values(SeedUsers);
  await prisma.user.createMany({ data: users });

  const accounts = Object.values(SeedAccounts).flat();
  await prisma.youtubeAccount.createMany({ data: accounts });
};

seed();
