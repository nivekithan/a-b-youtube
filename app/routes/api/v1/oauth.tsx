import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import jwtDecode from "jwt-decode";
import { prisma } from "~/db.server";
import { getGoogleOAuthClient } from "~/models/google.server";
import { createUserSession } from "~/server/session.server";
import { nanoid } from "nanoid";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const urlParams = url.searchParams;

  const code = urlParams.get("code");

  if (code === null) {
    throw redirect("/");
  }
  const googleAuthClient = getGoogleOAuthClient();
  const googleRes = await googleAuthClient.getToken(code);

  const tokens = googleRes.tokens;

  const { access_token, refresh_token, id_token } = tokens;

  if (
    access_token === null ||
    access_token === undefined ||
    refresh_token === null ||
    refresh_token === undefined ||
    id_token === null ||
    id_token === undefined
  ) {
    throw redirect("/");
  }

  const id: any = jwtDecode(id_token);

  const name = id.name as string;
  const sub = id.sub as string;
  const pictureUrl = id.picture as string;

  const isUserPresent = await prisma.user.findUnique({
    where: { googleSub: sub },
  });

  if (!isUserPresent) {
    const userId = nanoid();
    await prisma.user.create({
      data: {
        googleSub: sub,
        name,
        userId: userId,
        pictureUrl: pictureUrl,
      },
    });
    const redirectRes = await createUserSession(userId, "/");
    return redirectRes;
  } else {
    await prisma.user.update({
      where: { googleSub: sub },
      data: { name: name, pictureUrl: pictureUrl },
    });

    const userId = isUserPresent.userId;
    const redirectRes = await createUserSession(userId, "/");
    return redirectRes;
  }
};
