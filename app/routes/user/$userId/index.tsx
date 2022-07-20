import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { unstable_createMemoryUploadHandler } from "@remix-run/server-runtime";
import {
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { BigOutlineLink } from "~/components/buttonAndLinks";
import { prisma } from "~/db.server";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import type { YoutubePlaylistItem, YoutubeVideo } from "~/models/videos.server";
import { getVideo } from "~/models/videos.server";
import {
  getCountOfConnectedYoutubeAccounts,
  getRecentlyUploadedPlaylistItem,
} from "~/models/youtubeAccount.server";
import { ThumbnailQueue } from "~/server/bull.server";
import { storeFile } from "~/server/storage.server";
import { badRequest, encrypt, getEnvVar } from "~/server/utils.server";

const ZVideoSchema = z.union([
  z.object({
    videoId: z.string(),
    thumbnailUrl: z.string(),
    width: z.number(),
    height: z.number(),
    videoTitle: z.string(),
    channelId: z.string(),
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
  playlistItem: YoutubePlaylistItem[number] | null,
  video: YoutubeVideo | null
): ClientVideo => {
  if (playlistItem === null || video === null) return null;
  return {
    videoId: playlistItem.contentDetails.videoId,
    thumbnailUrl: playlistItem.snippet.thumbnails.medium.url,
    channelId: video.snippet.channelId,
    width: playlistItem.snippet.thumbnails.medium.width,
    height: playlistItem.snippet.thumbnails.medium.height,
    videoTitle: video.snippet.title,
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

  const recentlyUploadedPlaylistItem = await getRecentlyUploadedPlaylistItem(
    ...youtubeAccounts
  );

  const video =
    recentlyUploadedPlaylistItem === null
      ? null
      : await getVideo(
          recentlyUploadedPlaylistItem.youtubeAccount,
          recentlyUploadedPlaylistItem.playlistItem.contentDetails.videoId
        );

  const clientVideo = normalizeYoutubeVideo(
    recentlyUploadedPlaylistItem?.playlistItem ?? null,
    video
  );

  return json<LoaderData>({
    connectedYoutubeAccountsCount: count,
    googleAuthUrl: googleAuthUrl,
    recentlyPublishedVideo: clientVideo,
  });
};

const validActionType = {
  addTest: "addTest",
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");

  const fileUploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, name }) => {
      if (name !== "thumbnails") {
        return undefined;
      }

      const fileId = await storeFile(data);

      return JSON.stringify({ id: fileId, contentType: contentType });
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );

  const actionType = formData.get("actionType");

  if (!actionType || typeof actionType !== "string") {
    return badRequest("Action type is required");
  }

  if (!Object.keys(validActionType).includes(actionType)) {
    return badRequest("Invalid action type");
  }

  if (actionType === validActionType.addTest) {
    const stringifiedThumbnails = formData.getAll("thumbnails");

    const parsedThumbnails = stringifiedThumbnails.map((thumbnailInStr) => {
      if (!thumbnailInStr || typeof thumbnailInStr !== "string") {
        throw badRequest("Thumbnails is required");
      }

      const ZThumbnailSchema = z.object({
        id: z.string(),
        contentType: z.string(),
      });

      const thumbnails = ZThumbnailSchema.parse(JSON.parse(thumbnailInStr));

      return thumbnails;
    });

    if (parsedThumbnails.length <= 0) {
      return badRequest("Thumbnails is required");
    }

    const videoId = formData.get("videoId");

    if (!videoId || typeof videoId !== "string") {
      return badRequest("Video id is required");
    }

    const testDaysInStr = formData.get("testDays");

    if (!testDaysInStr || typeof testDaysInStr !== "string") {
      return badRequest("Test days is required");
    }
    const testDays = parseInt(testDaysInStr, 10);

    const channelId = formData.get("channelId");

    if (!channelId || typeof channelId !== "string") {
      return badRequest("Channel id is required");
    }

    const thumbnailJob = await prisma.thumbnailJob.create({
      data: {
        videoId: videoId,
        testDays: testDays,
        currentDay: 0,
        youtubeAccount: {
          connect: {
            userId_channelId: { userId: userId, channelId: channelId },
          },
        },
        user: { connect: { userId: userId } },
        thumbnails: {
          createMany: {
            data: parsedThumbnails.map((thumbnail) => {
              return {
                fileId: thumbnail.id,
                videoId: videoId,
                userId: userId,
                contentType: thumbnail.contentType,
              };
            }),
          },
        },
      },
    });

    const id = thumbnailJob.jobId;
    await ThumbnailQueue.add(`${id}`, { id: id });
  }

  return json({ okay: "okay" });
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
              style={{
                width: recentlyPublishedVideo.width,
                height: recentlyPublishedVideo.height,
              }}
            />
            <p>
              {`The video id is ${recentlyPublishedVideo.videoId} and title is ${recentlyPublishedVideo.videoTitle}`}
            </p>

            <Form
              method="post"
              encType="multipart/form-data"
              className="flex flex-col gap-y-3"
            >
              <input
                name="videoId"
                hidden
                value={recentlyPublishedVideo.videoId}
                readOnly
              />
              <input
                name="channelId"
                hidden
                value={recentlyPublishedVideo.channelId}
                readOnly
              />
              <label htmlFor="testDays">
                Number of days you want this test to happen
              </label>
              <input
                id="testDays"
                name="testDays"
                type="number"
                className="border-[3px] border-black max-w-[30%] rounded-md px-3 py-2"
              />
              <label htmlFor="thumbnails">Thumbanils for test</label>
              <input
                id="thumbnails"
                name="thumbnails"
                type="file"
                multiple
                accept="image/jpeg"
                className="border-[3px] border-blue-400 rounded-md max-w-[30%] px-3 py-2"
              />
              <div>
                <button
                  type="submit"
                  className="px-3 py-2 text-white bg-gray-700 rounded-md"
                  name="actionType"
                  value={validActionType.addTest}
                >
                  Submit thumbnails
                </button>
              </div>
            </Form>
          </div>
        );
      })()}
    </div>
  );
}
