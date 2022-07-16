import {
  createCookie,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";
import { getEnvVar } from "./utils.server";

const userIdCookie = createCookie("userId", {
  secrets: [getEnvVar("SESSION_SECRET")],
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true,
});

const userSession = createCookieSessionStorage({ cookie: userIdCookie });

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await userSession.getSession();
  session.set("userId", userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await userSession.commitSession(session),
    },
  });
};

export const getUserSession = async (request: Request) => {
  return userSession.getSession(request.headers.get("Cookie"));
};

export const removeUserSession = async (
  request: Request,
  redirectTo: string
) => {
  const session = await getUserSession(request);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await userSession.destroySession(session),
    },
  });
};
