import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getUserSession } from "~/server/session.server";

export type TUser = {
  userId: string;
  oauthToken: string;
  refreshToken: string;
  name: string;
  pictureUrl: string;
};

export const getUserFromUserId = async (userId: string): Promise<TUser> => {
  const userDb = await prisma.user.findUniqueOrThrow({
    where: { userId: userId },
    include: { oAuthToken: true, refreshToken: true },
  });

  const oAuthDb = userDb.oAuthToken;
  const refreshDb = userDb.refreshToken;

  if (oAuthDb === null) throw new Error(`Could not find oAuthToken`);
  if (refreshDb === null) throw new Error(`Could not find refreshToken`);

  return {
    userId,
    name: userDb.name,
    oauthToken: oAuthDb.token,
    refreshToken: refreshDb.token,
    pictureUrl: userDb.pictureUrl,
  };
};

export const requireUserId = async (
  request: Request,
  redirectTo: string
): Promise<string> => {
  const userId = await getUserId(request);

  if (userId === null) throw redirect(redirectTo);

  return userId;
};

export const getUserId = async (request: Request): Promise<string | null> => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    return null;
  }

  return userId;
};
