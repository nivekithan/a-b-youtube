import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { BigOutlineLink } from "~/components/buttonAndLinks";
import { prisma } from "~/db.server";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import type {
  YoutubeVideo} from "~/models/videos.server";
import {
  getCountOfConnectedYoutubeAccounts,
  getRecentlyUploadedVideoFromAccounts,
} from "~/models/youtubeAccount.server";
import { encrypt, getEnvVar } from "~/server/utils.server";

const ZVideoSchema = z.union([
  z.object({
    videoId: z.string(),
    thumbnailUrl: z.string(),
    title: z.string(),
  }),
  z.null(),
]);

const ZLoaderSchema = z.object({
  connectedYoutubeAccountsCount: z.number(),
  googleAuthUrl: z.string(),
  recentlyPublishedVideo: ZVideoSchema,
});

type ClientVideo = z.infer<typeof ZVideoSchema>;
type LoaderData = z.infer<typeof ZLoaderSchema>;

const normalizeYoutubeVideo = (
  youtubeVideo: YoutubeVideo[number] | null
): ClientVideo => {
  if (youtubeVideo === null) return null;

  return {
    videoId: youtubeVideo.contentDetails.videoId,
    thumbnailUrl: youtubeVideo.snippet.thumbnails.medium.url,
    title: youtubeVideo.snippet.videoOwnerChannelTitle,
  };
};

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
    take: 1,
  });

  const recentlyUploadedVideo = await getRecentlyUploadedVideoFromAccounts(
    ...youtubeAccounts
  );

  const clientVideo = normalizeYoutubeVideo(recentlyUploadedVideo);

  return json<LoaderData>({
    connectedYoutubeAccountsCount: count,
    googleAuthUrl: googleAuthUrl,
    recentlyPublishedVideo: clientVideo,
  });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();

  return (
    <div className="h-screen w-full flex flex-col gap-y-10">
      {`Number of connected Accounts ${loaderData.connectedYoutubeAccountsCount}`}
      <BigOutlineLink href={loaderData.googleAuthUrl}>
        Connect your youtube account
      </BigOutlineLink>
      {(() => {
        if (loaderData.recentlyPublishedVideo === null) return null;

        const recentlyPublishedVideo = loaderData.recentlyPublishedVideo;
        return (
          <div className="flex flex-col gap-y-6">
            <img
              src={recentlyPublishedVideo.thumbnailUrl}
              alt="Recently published video thumbnail"
            />
            <p>
              {`The video id is ${recentlyPublishedVideo.videoId} and title is ${recentlyPublishedVideo.title}`}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
