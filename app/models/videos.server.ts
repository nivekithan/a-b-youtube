import { google } from "googleapis";
import { getGoogleOAuthClient } from "~/server/utils.server";
import { refreshToken } from "./oauth.server";
import type { TUser } from "./user.server";

export type TVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: URL;
};

export const getUploadPlaylistId = async (
  user: TUser
): Promise<string | null> => {
  try {
    const googleAuthClient = getGoogleOAuthClient();
    googleAuthClient.setCredentials({ access_token: user.oauthToken });

    const channelGoogleRes = await google.youtube("v3").channels.list({
      auth: googleAuthClient,
      mine: true,
      part: ["contentDetails"],
    });

    const uploadPlaylist =
      channelGoogleRes.data.items?.[0].contentDetails?.relatedPlaylists
        ?.uploads;

    if (uploadPlaylist === undefined) {
      return null;
    }

    return uploadPlaylist;
  } catch (err: any) {
    if (err.message === "Invalid Credentials") {
      await refreshToken(user);
      return getUploadPlaylistId(user);
    }

    return null;
  }
};

export const getLatestVideosInPlaylist = async (
  user: TUser,
  playlistId: string
): Promise<TVideo[] | null> => {
  try {
    const googleAuthClient = getGoogleOAuthClient();
    googleAuthClient.setCredentials({
      access_token: user.oauthToken,
      refresh_token: user.refreshToken,
    });

    const playlistItems = await google.youtube("v3").playlistItems.list({
      auth: googleAuthClient,
      part: ["contentDetails", "snippet"],
      maxResults: 10,
      playlistId: playlistId,
    });

    const youtubeVideos = playlistItems.data.items?.map(
      (playlistItem): TVideo => {
        const videoId = playlistItem.contentDetails?.videoId;
        const titleName = playlistItem.snippet?.title;
        const thumbnailUrl = playlistItem.snippet?.thumbnails?.high?.url;

        if (
          typeof videoId !== "string" ||
          typeof titleName !== "string" ||
          typeof thumbnailUrl !== "string"
        ) {
          throw new Error(`Could not find videoId, titleName or thumbnail`);
        }

        return {
          videoId: videoId,
          title: titleName,
          thumbnailUrl: new URL(thumbnailUrl),
        };
      }
    );

    if (youtubeVideos === undefined) {
      return null;
    }

    return youtubeVideos;
  } catch (err: any) {
    if (err.message === "Invalid Credentials") {
      await refreshToken(user);
      return getLatestVideosInPlaylist(user, playlistId);
    }
    return null;
  }
};
