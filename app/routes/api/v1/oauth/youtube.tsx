import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getGoogleOAuthClient } from "~/models/google.server";
import { getChannelOfToken } from "~/models/youtubeAccount.server";
import { decrypt, getEnvVar } from "~/server/utils.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const state = searchParams.get("state");

  if (!state) return redirect("/");

  const userId = decrypt(state);

  const isUserIdPresent = await prisma.user.findUnique({
    where: { userId: userId },
  });

  if (isUserIdPresent === null) return redirect("/404");

  const code = searchParams.get("code");

  if (!code) return redirect("/404");

  const googleAuthClient = getGoogleOAuthClient({
    redirectUrl: `${getEnvVar("GOOGLE_API_REDIRECT_URI")}/youtube`,
  });

  const googleRes = await googleAuthClient.getToken(code);

  const tokens = googleRes.tokens;

  const { access_token, refresh_token} = tokens;

  if (!access_token || typeof access_token !== "string")
    return redirect("/404/access_token");

  const channel = await getChannelOfToken(access_token);

  if (channel instanceof Error) return redirect("/404/channel");

  const channelId = channel.id;
  const channelPictureLink = channel.snippet.thumbnails.medium.url;
  const name = channel.snippet.title;

  const mayBeConnectedAccount = await prisma.youtubeAccount.findFirst({
    where: { channelId: channelId, userId: userId },
  });

  if (mayBeConnectedAccount) {
    await prisma.youtubeAccount.update({
      where: { accountId: mayBeConnectedAccount.accountId },
      data: {
        channelName: name,
        ChannelProfilePictureLink: channelPictureLink,
        oauthToken: access_token,
        refreshToken: refresh_token ?? undefined,
      },
    });
  } else {
    if (!refresh_token || typeof refresh_token !== "string")
      return redirect("/404/refresh_token");

    await prisma.youtubeAccount.create({
      data: {
        channelId: channelId,
        channelName: name,
        ChannelProfilePictureLink: channelPictureLink,
        oauthToken: access_token,
        refreshToken: refresh_token,
        user: { connect: { userId: userId } },
      },
    });
  }


  return redirect(`/user/${userId}`);
};
