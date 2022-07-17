import type { YoutubeAccount } from "@prisma/client";
import { google } from "googleapis";
import { z } from "zod";
import { getGoogleOAuthClient } from "./google.server";
import { ifNeededRefreshToken } from "./youtubeAccount.server";

const ZPlaylistItemsSchema = z.array(
  z.object({
    snippet: z.object({
      publishedAt: z.string(),
      thumbnails: z.object({
        default: z.object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        }),
        medium: z.object({
          url: z.string(),
          width: z.number(),
          height: z.number(),
        }),
      }),
      videoOwnerChannelTitle: z.string(),
    }),
    contentDetails: z.object({ videoId: z.string() }),
  })
);

export type YoutubePlaylistItem = z.infer<typeof ZPlaylistItemsSchema>;

export const getRecentVideosFromAccount = async (
  youtubeAccount: YoutubeAccount,
  count: number
) => {
  await ifNeededRefreshToken(youtubeAccount);
  const uploadsPlaylistId = youtubeAccount.uploadsPlaylistId;

  const googleAuthClient = getGoogleOAuthClient();
  googleAuthClient.setCredentials({
    access_token: youtubeAccount.oauthToken,
  });

  const playlistItemRes = await google.youtube("v3").playlistItems.list({
    auth: googleAuthClient,
    part: ["contentDetails", "snippet"],
    playlistId: uploadsPlaylistId,
    maxResults: count,
  });

  const items = playlistItemRes.data.items;

  return ZPlaylistItemsSchema.parse(items);
};

const ZVideoSchema = z.object({ snippet: z.object({ title: z.string() }) });

export type YoutubeVideo = z.infer<typeof ZVideoSchema>;

export const getVideo = async (
  youtubeAccount: YoutubeAccount,
  videoId: string
) => {
  await ifNeededRefreshToken(youtubeAccount);
  const googleAuthClient = getGoogleOAuthClient();
  googleAuthClient.setCredentials({
    access_token: youtubeAccount.oauthToken,
  });

  const videoRes = await google
    .youtube("v3")
    .videos.list({ id: [videoId], part: ["snippet"], auth: googleAuthClient });

  const videoItems = videoRes.data.items;

  if (videoItems === undefined || videoItems.length === 0)
    throw new Error(`There is no video with id ${videoId}`);

  const video = videoItems[0];

  return ZVideoSchema.parse(video);
};
