import type { YoutubeAccount } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { Settings } from "~/components/settings";
import { prisma } from "~/db.server";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import { badRequest, encrypt, getEnvVar } from "~/server/utils.server";

const ZRouteLoaderSchema = z.object({
  accounts: z.array(
    z.object({ img: z.string(), name: z.string(), accountId: z.number() })
  ),
  googleAuthUrl: z.string(),
});

type RouteLoaderData = z.infer<typeof ZRouteLoaderSchema>;

const normalizeYoutubeAccounts = (
  account: YoutubeAccount
): RouteLoaderData["accounts"][number] => {
  return {
    img: account.ChannelProfilePictureLink,
    name: account.channelName,
    accountId: account.accountId,
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");

  const youtubeAccounts = await prisma.youtubeAccount.findMany({
    where: { userId: userId },
  });

  const normalizedYoutubeAccounts = youtubeAccounts.map(
    normalizeYoutubeAccounts
  );

  const encryptedUserId = encrypt(userId);

  const googleAuthUrl = generateGoogleSignUpUrl({
    scopes: { youtube: true },
    state: encryptedUserId,
    redirectUrl: `${getEnvVar("GOOGLE_API_REDIRECT_URI")}/youtube`,
  });

  return json<RouteLoaderData>({
    accounts: normalizedYoutubeAccounts,
    googleAuthUrl: googleAuthUrl,
  });
};

const useZLoaderData = () => {
  const loaderData = useLoaderData();
  return ZRouteLoaderSchema.parse(loaderData);
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const formData = await request.formData();

  const actionType = formData.get("actionType");

  if (!actionType || typeof actionType !== "string") {
    return badRequest("ActionType is required");
  }

  if (actionType === "removeAccount") {
    const accountIdStr = formData.get("accountId");
    if (!accountIdStr || typeof accountIdStr !== "string") {
      return badRequest("AccountId is required");
    }

    const accountId = parseInt(accountIdStr, 10);

    if (Number.isNaN(accountId)) {
      return badRequest("AccountId is not a number");
    }

    await prisma.youtubeAccount.deleteMany({
      where: { accountId: accountId, userId: userId },
    });
    return json({ ok: "okay" });
  } else {
    return badRequest("Unknown actionType");
  }
};

export default function RenderSettings() {
  const loaderData = useZLoaderData();

  return (
    <Settings
      accounts={loaderData.accounts}
      googleAuthUrl={loaderData.googleAuthUrl}
    />
  );
}
