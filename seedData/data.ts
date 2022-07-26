import type { User, YoutubeAccount } from "@prisma/client";

export const SeedUsersType = {
  NO_CONNECTED_ACCOUNT: "NO_CONNECTED_ACCOUNT",
  NO_THUMBNAIL_JOB_ACCOUNT: "NO_THUMBNAIL_JOB_ACCOUNT",
  EXPIRED_TOKEN_ACCOUNT: "EXPIRED_TOKEN_ACCOUNT",
};

export const SeedUsers: Record<keyof typeof SeedUsersType, User> = {
  NO_CONNECTED_ACCOUNT: {
    googleSub: "sub:no-connected-account",
    name: "No Connected Account",
    pictureUrl:
      "https://gravatar.com/avatar/316497fccdcc2d03a1039de7e9131d14?s=400&d=robohash&r=x",
    userId: "userid:no-connected-account",
  },
  NO_THUMBNAIL_JOB_ACCOUNT: {
    googleSub: "sub:no-thumbnail-job-account",
    name: "No Thumbnail Job Account",
    pictureUrl:
      "https://gravatar.com/avatar/540c4d3192a386e2991bdcaa04e2ec9c?s=400&d=robohash&r=x",
    userId: "userid:no-thumbnail-job-account",
  },
  EXPIRED_TOKEN_ACCOUNT: {
    googleSub: "sub:expired-token-account",
    name: "Expired Token Account",
    pictureUrl:
      "https://gravatar.com/avatar/1c8e8a6e8d1fe52b782b280909abeb38?s=400&d=robohash&r=x",
    userId: "userid:expired-token-account",
  },
};

export const SeedAccounts: Record<
  keyof typeof SeedUsersType,
  YoutubeAccount[]
> = {
  NO_CONNECTED_ACCOUNT: [],
  NO_THUMBNAIL_JOB_ACCOUNT: [
    {
      accountId: 1,
      channelId: "channelId:no-thumbnail-job-account",
      channelName: "channelName:no-thumbnail-job-account",
      ChannelProfilePictureLink:
        "https://gravatar.com/avatar/f5578f8abbe6ba54058f3eb836af8a2d?s=400&d=robohash&r=x",
      expiresIn: new Date(new Date().getTime() + 2 * 360 * 24 * 60 * 60 * 1000),
      oauthToken: "oauthToken:no-thumbnail-job-account",
      refreshToken: "refreshToken:no-thumbnail-job-account",
      uploadsPlaylistId: "uploadsPlaylistId:no-thumbnail-job-account",
      userId: SeedUsers.NO_THUMBNAIL_JOB_ACCOUNT.userId,
    },
  ],
  EXPIRED_TOKEN_ACCOUNT: [
    {
      accountId: 2,
      channelId: "channelid:expired-token-account",
      channelName: "channelname:expired-token-account",
      ChannelProfilePictureLink:
        "https://gravatar.com/avatar/e8b3a8e85e727056ac0859e65a253d5c?s=400&d=robohash&r=x",
      expiresIn: new Date(new Date().getTime() - 2 * 360 * 24 * 60 * 60 * 1000),
      oauthToken: "oauthToken:expired-token-account",
      refreshToken: "refreshToken:expired-token-account",
      uploadsPlaylistId: "uploadsPlaylistId:expired-token-account",
      userId: SeedUsers.EXPIRED_TOKEN_ACCOUNT.userId,
    },
  ],
};
