import { google } from "googleapis";
import type { TUser } from "./user.server";
import http from "node:http";
import { getGoogleOAuthClient, refreshToken } from "./google.server";

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

export const setThumbnail = async (
  user: TUser,
  video: TVideo
): Promise<unknown> => {
  try {
    const googleAuthClient = getGoogleOAuthClient();
    googleAuthClient.setCredentials({ access_token: user.oauthToken });

    const uploadingPromise = new Promise((resolve, reject) => {
      http.get(
        "https://lh3.googleusercontent.com/fife/AAWUweXxOl1w33JOOWXwmVNApq4Gwda8aQ4NwRnMSSloWzUEL58jhD0MhkUdsqKHAWQ6UEa3XplKUIIXe8in0jNuBO68KhaxGn2f95N98bAKaie70Dvv5BMEcpedDZ3qpG4pXDQxd6Kcflbm3d3iotaEeHzkuUIz2AWy8v_baDxW-bbSTHAJdWDtn-1aicbrh_mWPQK-vyzBPB1lVEbyHdqMBxSVKVgKcfvij-cOae80ecH39IbDyx70xIs45uubvcQbbBWVZsYj81_GUkRQ6AlEFKkuwXGmvF0l0W9-VRDF9gpUgsp7TAbc-Jq4ywT4fS6LA1HMLThYRfrjmpsy-hzUjI_iEY5QDg1Km_dFq7__BbaLpBNxhu7S5KidqWoOuF5NdcklxX53yRuXct9TYDYPgbrnEddyidilURw1GqBqkOss9iA9GUPfP9fPnm4SQc2ECtfJXn7ua-9swj1tNtCVrLFtcdWSXMUeaIhUneN_Zcn5_2S7wRcO4truPZdDWTR1A976PtjWm_3FlTUPobbQDYToGAtmXNJuVeUPsA5J34gT-rUvhrzHuJj5cI8WV7kE2wF6Q25aEytkGW9BStFoQY9DATgnj0nAlcYfaIFoF2aFaGEPRP-_ZBRvHvW40dICbGgpLASP62OORfPXMK1LiryiIgnJ0DUS1StPRhJLUHinioqvOsfpug_-5m5P4cmUiDM2vFoqqwxiWbVRJwUKvFmf15T42aSZZdEkir1aoltd-nCAnEltxkazBxEZNJQrFXQCuvVNrBedxOa4i8PmMPgrky1CGgQSYKCUwsW-chhYJouGpxKydM24_2Ufhgg2qCtowZ42AYB_jfVv7ATnN5P3RzitE9KqDmZGC0FfYtGnfw4kLiXeu3OrrqTZw8s17SFH1OJT8rku0rDKxo8_JOLU9nPZcVZbvdGyQpQeGcv2yzf19-vBy_zpglIYQ4NoGTnVPPn5dz8HuRet6McL7QPgQBQ-3qC1_Ev-iGQWHjA1Yrez7aTCCd0LPliAzGOT37If1KNsdJXyC8JIVvGz29mj699PyqffcIO0182_cC8YtGJ3pMQQe-Tru3gJ_vT2tCerAuWndy9LE77vFI7VSM5A2gY0LaZLc5zFqwaf-pRcXfd0kS6mfwuEZ5gr8Tprgsb6ItCcnQQeNwmEfRDNBmnDLehq0DU9Pxf613Epq4toyMM70yg--gMG8KmY3xhgW2T28XQyVPaN0Ax5uNoGKR5dwqJIzTPL3FozRuEi8gnPku_FWOsMlypREyfIxWuUODEYJJncrliJ_nCuEMu6DUQ5ZI2cCNCDJI2MGxQlcmwo7xcL-L38jt2QNzQo_HvQgshEYXYppZxHehrbha_TjRq35mQGj-yPY9dIU7W78554TnoOhoRBv_SWGN66H1my7r5p3DvkTGdvntdFEdOapcYYp_CyBkwK4zl9cWZZiuPtiPXwN3zW1kseg0Uj=w1920-h955",
        async (res) => {
          try {
            const setThumbnailResp = await google.youtube("v3").thumbnails.set({
              auth: googleAuthClient,
              videoId: video.videoId,
              uploadType: "media",
              media: { mimeType: "image/jpeg", body: res },
            });

            resolve(setThumbnailResp);
          } catch (err) {
            reject(err);
          }
        }
      );
    });

    return uploadingPromise;
  } catch (err: any) {
    if (err.message === "Invalid Credentials") {
      await refreshToken(user);
      return setThumbnail(user, video);
    }
    return null;
  }
};
