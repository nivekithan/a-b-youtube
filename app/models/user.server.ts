import { redirect } from "@remix-run/server-runtime";
import { google } from "googleapis";
import { prisma } from "~/db.server";
import { getUserSession } from "~/server/session.server";
import { getGoogleOAuthClient } from "~/server/utils.server";
import { refreshToken } from "./oauth.server";

export type TUser = {
  userId: string;
  oauthToken: string;
  refreshToken: string;
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
    oauthToken: oAuthDb.token,
    refreshToken: refreshDb.token,
  };
};

export const requireUserId = async (
  request: Request,
  redirectTo: string
): Promise<string> => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (userId === null || typeof userId !== "string") throw redirect(redirectTo);

  return userId;
};

