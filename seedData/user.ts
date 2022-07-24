import type { User } from "@prisma/client";

export const SeedUsersType = {
  NO_CONNECTED_ACCOUNT: "NO_CONNECTED_ACCOUNT",
};

export const SeedUsers: Record<keyof typeof SeedUsersType, User> = {
  NO_CONNECTED_ACCOUNT: {
    googleSub: "sub:no-connected-account",
    name: "No Connected Account",
    pictureUrl:
      "https://gravatar.com/avatar/316497fccdcc2d03a1039de7e9131d14?s=400&d=robohash&r=x",
    userId: "userid:no-connected-account",
  },
};
