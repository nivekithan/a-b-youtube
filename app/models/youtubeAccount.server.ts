import type { YoutubeAccount } from "@prisma/client";
import { google } from "googleapis";
import { z } from "zod";
import { prisma } from "~/db.server";
import { getGoogleOAuthClient } from "./google.server";

export const getCountOfConnectedYoutubeAccounts = async (userId: string) => {
  const count = await prisma.youtubeAccount.count({
    where: { userId: userId },
  });

  return count;
};

const ZYoutubeChannelSchema = z.object({
  id: z.string(),
  snippet: z.object({
    title: z.string(),
    thumbnails: z.object({ medium: z.object({ url: z.string() }) }),
  }),
  contentDetails: z.object({
    relatedPlaylists: z.object({ uploads: z.string() }),
  }),
});

export type YoutubeChannel = z.infer<typeof ZYoutubeChannelSchema>;

export const getChannelOfToken = async (token: string) => {
  try {
    const googleAuthClient = getGoogleOAuthClient();
    googleAuthClient.setCredentials({ access_token: token });

    const channelRes = await google.youtube("v3").channels.list({
      mine: true,
      auth: googleAuthClient,
      part: ["id", "snippet", "contentDetails"],
    });
    if (!channelRes.data.items || channelRes.data.items.length === 0)
      throw new Error(`No channel found for passed token`);

    const channelItems = channelRes.data.items;

    const userChannel = channelItems[0];

    return ZYoutubeChannelSchema.parse(userChannel);
  } catch (err) {
    if (err instanceof Error) {
      return err;
    }

    throw err;
  }
};

export const ifNeededRefreshToken = async (account: YoutubeAccount) => {
  const oauthTokenExpiresIn = account.expiresIn;

  const expiresAtInMs = oauthTokenExpiresIn.getTime();

  const currentTimeInMs = new Date().getTime();

  const twoMinutes = 1000 * 60 * 2;

  if (expiresAtInMs <= currentTimeInMs + twoMinutes) {

    const googleAuthClient = getGoogleOAuthClient();
    googleAuthClient.setCredentials({
      access_token: account.oauthToken,
      refresh_token: account.refreshToken,
    });

    const newTokenRes = await googleAuthClient.refreshAccessToken();

    const newOauthToken = newTokenRes.credentials.access_token;

    const newExpiresAt = newTokenRes.credentials.expiry_date;

    if (!newOauthToken || typeof newOauthToken !== "string")
      throw new Error(`No new oauth token found while refreshing access token`);

    if (!newExpiresAt || typeof newExpiresAt !== "number")
      throw new Error(`No new expiresAt found while refreshing access token`);

    await prisma.youtubeAccount.update({
      where: { accountId: account.accountId },
      data: { oauthToken: newOauthToken, expiresIn: new Date(newExpiresAt) },
    });

    account.oauthToken = newOauthToken;
    account.expiresIn = new Date(newExpiresAt);

  }
};
