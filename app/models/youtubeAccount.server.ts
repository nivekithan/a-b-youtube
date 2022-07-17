import { prisma } from "~/db.server";

export const getCountOfConnectedYoutubeAccounts = async (userId: string) => {
  const count = await prisma.youtubeAccount.count({
    where: { userId: userId },
  });

  return count;
};
