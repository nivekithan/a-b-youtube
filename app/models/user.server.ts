import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getUserSession } from "~/server/session.server";

export const requireUserId = async (
  request: Request,
  redirectTo: string
): Promise<string> => {
  const userId = await getUserId(request);

  if (userId === null) throw redirect(redirectTo);

  return userId;
};

export const getUserId = async (request: Request): Promise<string | null> => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    return null;
  }

  return userId;
};

export const getUserFromUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { userId: userId } });

  return user;
};

export const requireUserFromUserId = async (userId: string) => {
  const user = await getUserFromUserId(userId);

  if (user === null) throw redirect("/logout");

  return user;
};
