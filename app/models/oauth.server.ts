import { prisma } from "~/db.server";
import { getGoogleOAuthClient } from "~/server/utils.server";
import { TUser } from "./user.server";

export const refreshToken = async (user: TUser) => {
  const oAuthClient = getGoogleOAuthClient();

  oAuthClient.setCredentials({
    access_token: user.oauthToken,
    refresh_token: user.refreshToken,
  });

  const res = await oAuthClient.refreshAccessToken();

  const newAccessToken = res.credentials.access_token;

  if (newAccessToken === undefined || newAccessToken === null) {
    throw new Error(`Could not refresh access token`);
  }

  user.oauthToken = newAccessToken;

  await prisma.oAuthToken.update({
    data: { token: newAccessToken },
    where: { userId: user.userId },
  });
};
