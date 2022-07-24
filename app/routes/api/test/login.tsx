import type { LoaderFunction } from "@remix-run/server-runtime";
import { SeedUsers, SeedUsersType } from "seedData/user";
import { createUserSession } from "~/server/session.server";
import { badRequest, getEnvVar } from "~/server/utils.server";

export const loader: LoaderFunction = async ({ request }) => {
  const NODE_ENV = getEnvVar("NODE_ENV");

  if (NODE_ENV !== "test" && NODE_ENV !== "development") {
    throw new Error("This loader is only for test environment");
  }

  const url = new URL(request.url);

  const searchParams = url.searchParams;

  const typeOfUser = searchParams.get("userType");

  if (typeOfUser === null) throw badRequest("userType is required");

  if (!Object.keys(SeedUsersType).includes(typeOfUser)) {
    throw badRequest("userType is invalid");
  }

  const user = SeedUsers[typeOfUser as keyof typeof SeedUsersType];
  const userId = user.userId;

  return createUserSession(userId, "/");
};
