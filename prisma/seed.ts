import { SeedUsers } from "seedData/user";
import { prisma } from "~/db.server";

const seed = async () => {
  const users = Object.values(SeedUsers);
  await prisma.user.createMany({ data: users });
};

seed();
