import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { unstable_createMemoryUploadHandler } from "@remix-run/server-runtime";
import {
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import { getCountOfConnectedYoutubeAccounts } from "~/models/youtubeAccount.server";
import { storeFile } from "~/server/storage.server";
import { badRequest, encrypt, getEnvVar } from "~/server/utils.server";
import { createAbtest } from "~/models/abTest.server";
import { Home } from "~/components/home";
import { Form, useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/navbar";

// const ZVideoSchema = z.union([
//   z.object({
//     videoId: z.string(),
//     thumbnailUrl: z.string(),
//     width: z.number(),
//     height: z.number(),
//     videoTitle: z.string(),
//     channelId: z.string(),
//   }),
//   z.null(),
// ]);

const ZLoaderSchema = z.object({
  connectedYoutubeAccountsCount: z.number(),
  googleAuthUrl: z.string(),
  thumbnailJobs: z.array(z.object({})),
  // recentlyPublishedVideo: ZVideoSchema,
});

// type ClientVideo = z.infer<typeof ZVideoSchema>;
type LoaderData = z.infer<typeof ZLoaderSchema>;

// const normalizeYoutubeVideo = (
//   playlistItem: YoutubePlaylistItem[number] | null,
//   video: YoutubeVideo | null
// ): ClientVideo => {
//   if (playlistItem === null || video === null) return null;
//   return {
//     videoId: playlistItem.contentDetails.videoId,
//     thumbnailUrl: playlistItem.snippet.thumbnails.medium.url,
//     channelId: video.snippet.channelId,
//     width: playlistItem.snippet.thumbnails.medium.width,
//     height: playlistItem.snippet.thumbnails.medium.height,
//     videoTitle: video.snippet.title,
//   };
// };

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const count = await getCountOfConnectedYoutubeAccounts(userId);

  const encryptedUserId = encrypt(userId);

  const googleAuthUrl = generateGoogleSignUpUrl({
    scopes: { youtube: true },
    state: encryptedUserId,
    redirectUrl: `${getEnvVar("GOOGLE_API_REDIRECT_URI")}/youtube`,
  });

  // const youtubeAccounts = await prisma.youtubeAccount.findMany({
  //   where: { userId: userId },
  //   take: 1,
  // });

  // const recentlyUploadedPlaylistItem = await getRecentlyUploadedPlaylistItem(
  //   ...youtubeAccounts
  // );

  // const video =
  //   recentlyUploadedPlaylistItem === null
  //     ? null
  //     : await getVideo(
  //         recentlyUploadedPlaylistItem.youtubeAccount,
  //         recentlyUploadedPlaylistItem.playlistItem.contentDetails.videoId
  //       );

  // const clientVideo = normalizeYoutubeVideo(
  //   recentlyUploadedPlaylistItem?.playlistItem ?? null,
  //   video
  // );

  return json<LoaderData>({
    connectedYoutubeAccountsCount: count,
    googleAuthUrl: googleAuthUrl,
    thumbnailJobs: [],
    // recentlyPublishedVideo: clientVideo,
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
    await createAbtest({ formData, userId });
  }

  return json({ okay: "okay" });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();

  const isAnyAccountConnected = loaderData.connectedYoutubeAccountsCount !== 0;

  const isAnyThumbnailJobsCreated = loaderData.thumbnailJobs.length !== 0;

  // const isAccountCreatedButNoJobsCreated =
  //   isAnyAccountConnected && !isAnyThumbnailJobsCreated;

  return (
    <>
      <Form className="hero">
        <Home />
      </Form>
    </>
  );
}

// type NoAccountConnectedProps = {
//   googleAuthUrl: string;
// };

// const NoAccountConnected = ({ googleAuthUrl }: NoAccountConnectedProps) => {
//   return (
//     <div className="max-w-lg flex flex-col gap-y-4 items-center">
//       <h3 className="text-xl text-center">
//         No youtube account is connected. Connect now to start testing your
//         thumbnails
//       </h3>
//       <a
//         href={googleAuthUrl}
//         className="bg-gray-700 text-white px-16 py-2 rounded-md"
//       >
//         Connect Your Youtube account
//       </a>
//     </div>
//   );
// };

// const AccountCreatedButNoJobsCreated = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const actionData = useActionData<string | unknown>();

//   const transition = useTransition();

//   const [prevIsReloadingDueToAction, setPrevIsReloadingDueToAction] =
//     useState(false);

//   const isReloadingDueToAction = transition.type === "actionReload";

//   if (prevIsReloadingDueToAction !== isReloadingDueToAction) {
//     if (!prevIsReloadingDueToAction && typeof actionData !== "string") {
//       setModalOpen(false);
//     }
//     console.log(prevIsReloadingDueToAction, isReloadingDueToAction);
//     setPrevIsReloadingDueToAction(isReloadingDueToAction);
//   }

//   const onOpenChange = (open: boolean) => {
//     setModalOpen(open);
//   };

//   return (
//     <Dialog.Root onOpenChange={onOpenChange} open={modalOpen}>
//       <div className="flex flex-col gap-y-4 items-center">
//         <h3 className="text-xl text-center">
//           No A/B Testing has been created. Click to get started
//         </h3>
//         <Dialog.Trigger
//           className="bg-gray-700 text-white px-16 py-2 rounded-md"
//           type="button"
//         >
//           Start A/B Testing
//         </Dialog.Trigger>
//         <Dialog.Portal>
//           <Dialog.Overlay className="bg-black top-0 left-0 right-0 bottom-0 fixed bg-opacity-50 grid place-items-center">
//             <Dialog.Content className="min-w-[540px] border-2 rounded-md bg-white border-gray-200 flex flex-col gap-y-6 pb-4">
//               <Dialog.Title className="bg-gray-200 px-10 py-6 font-bold  rounded-md">
//                 Start A/B Testing your thumbnails
//               </Dialog.Title>
//               <Form
//                 method="post"
//                 encType="multipart/form-data"
//                 className=" px-10 flex flex-col gap-y-8 mt-2"
//                 id="add-test-form"
//               >
//                 {/* URL input */}
//                 <div className="flex flex-col gap-y-3">
//                   <label className="text-gray-700" htmlFor="videoUrl">
//                     Url of your video
//                   </label>
//                   <div className="flex flex-col gap-y-2">
//                     <input
//                       id="videoUrl"
//                       name="videoUrl"
//                       type="url"
//                       placeholder="Url to your video"
//                       className="border border-black py-2 px-3 rounded-md"
//                     />
//                   </div>
//                 </div>
//                 {/* Test days input */}
//                 <div className="flex justify-between items-center">
//                   <label
//                     htmlFor="testDays"
//                     className="text-gray-700 max-w-[150px]"
//                   >
//                     Number of days test should happen
//                   </label>
//                   <div className="flex  rounded-md border-gray-300 border-[3px] focus:border-gray-600">
//                     <input
//                       id="testDays"
//                       type="text"
//                       name="testDays"
//                       className="px-4 py-2 w-[70px] focus:outline-none"
//                     />
//                     <div className="bg-gray-300 grid place-items-center px-2 text-gray-700 text-sm font-light">
//                       days
//                     </div>
//                   </div>
//                 </div>
//                 {/* Thumbnails Input */}
//                 <div className="flex flex-col gap-y-3">
//                   <label className="text-gray-700" htmlFor="thumbnails">
//                     Choose thumbnails
//                   </label>
//                   <div className="flex flex-col gap-y-2">
//                     <FileInput name="thumbnails" />
//                     <FileInput name="thumbnails" />
//                     <FileInput name="thumbnails" />
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <Dialog.Close className="text-sm text-gray-400 text-light hover:underline">
//                     Close the modal
//                   </Dialog.Close>
//                   <button
//                     className="px-4 py-2 bg-gray-700 text-white rounded-md"
//                     name="actionType"
//                     value={validActionType.addTest}
//                   >
//                     Start Testing
//                   </button>
//                 </div>
//               </Form>
//             </Dialog.Content>
//           </Dialog.Overlay>
//         </Dialog.Portal>
//       </div>
//     </Dialog.Root>
//   );
// };
