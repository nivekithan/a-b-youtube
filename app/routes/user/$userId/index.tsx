import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { BigOutlineLink } from "~/components/buttonAndLinks";
import { prisma } from "~/db.server";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import { getRecentVideosFromAccount } from "~/models/videos.server";
import { getCountOfConnectedYoutubeAccounts } from "~/models/youtubeAccount.server";
import { encrypt, getEnvVar } from "~/server/utils.server";

const ZLoaderSchema = z.object({
  connectedYoutubeAccountsCount: z.number(),
  googleAuthUrl: z.string(),
});

type LoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const count = await getCountOfConnectedYoutubeAccounts(userId);

  const encryptedUserId = encrypt(userId);

  const googleAuthUrl = generateGoogleSignUpUrl({
    scopes: { youtube: true },
    state: encryptedUserId,
    redirectUrl: `${getEnvVar("GOOGLE_API_REDIRECT_URI")}/youtube`,
  });

  const youtubeAccounts = await prisma.youtubeAccount.findMany({
    where: { userId: userId },
    take: 3,
  });

  const recentVideos = await Promise.all(
    youtubeAccounts.map(async (account) => {
      return getRecentVideosFromAccount(account);
    })
  );

  return json<LoaderData>({
    connectedYoutubeAccountsCount: count,
    googleAuthUrl: googleAuthUrl,
  });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();

  return (
    <div className="h-screen w-full grid place-items-center">
      {`Number of connected Accounts ${loaderData.connectedYoutubeAccountsCount}`}
      <BigOutlineLink href={loaderData.googleAuthUrl}>
        Connect your youtube account
      </BigOutlineLink>
    </div>
  );
}
