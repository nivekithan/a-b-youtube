import type {
  ThumbnailJob,
  ThumbnailResult,
  Thumbnails,
  User,
  YoutubeAccount,
} from "@prisma/client";

export const SeedUsersType = {
  NO_CONNECTED_ACCOUNT: "NO_CONNECTED_ACCOUNT",
  NO_THUMBNAIL_JOB_ACCOUNT: "NO_THUMBNAIL_JOB_ACCOUNT",
  EXPIRED_TOKEN_ACCOUNT: "EXPIRED_TOKEN_ACCOUNT",
  CURRENT_ACCOUNT: "CURRENT_ACCOUNT",
} as const;

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
  CURRENT_ACCOUNT: {
    googleSub: "sub:current-account",
    name: "Current Account",
    pictureUrl: "",
    userId: "userid:current-account",
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
  CURRENT_ACCOUNT: [
    {
      accountId: 3,
      channelId: "channelid:current-account",
      channelName: "channelname:current-account",
      ChannelProfilePictureLink: "saf",
      expiresIn: new Date(new Date().getTime() + 2 * 360 * 24 * 60 * 60 * 1000),
      oauthToken: "oauthToken:current-account",
      refreshToken: "refreshToken:current-account",
      uploadsPlaylistId: "uploadsPlaylistId:current-account",
      userId: SeedUsers.CURRENT_ACCOUNT.userId,
    },
  ],
};

export const seedThumbnailJob: Record<
  typeof SeedUsersType["CURRENT_ACCOUNT"],
  ThumbnailJob[]
> = {
  [SeedUsersType.CURRENT_ACCOUNT]: [
    {
      jobId: "jobId:current-account-1",
      videoName: "New video just dropped",
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      testDays: 10,
      currentDay: 5,
      videoId: "videoId:current-account-1",
      completed: false,
      userId: "userid:current-account",
      accountId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

export const seedThumbnails: Record<
  typeof SeedUsersType["CURRENT_ACCOUNT"],
  Thumbnails[]
> = {
  CURRENT_ACCOUNT: [
    {
      contentType: "image/jpeg",
      fileId: "fileIdcurrent-account-1",
      jobId: "jobId:current-account-1",
      userId: "userid:current-account",
      videoId: "videoId:current-account-1",
    },
  ],
};

export const seedThumbnailResult: Record<
  typeof SeedUsersType["CURRENT_ACCOUNT"],
  ThumbnailResult[]
> = {
  [SeedUsersType.CURRENT_ACCOUNT]: [
    {
      id: 1,
      clickThroughRate: 25.2434,
      averageViewDuration: 1000,
      at: "2022-05-01",
      createdAt: new Date(),
      updatedAt: new Date(),
      thumbnailId: "fileIdcurrent-account-1",
      jobId: "jobId:current-account-1",
    },
  ],
};
