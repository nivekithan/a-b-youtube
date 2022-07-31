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
import type { BadRequest } from "~/server/utils.server";
import { badRequest, encrypt, getEnvVar } from "~/server/utils.server";
import { createAbtest } from "~/models/abTest.server";
import { Home } from "~/components/home";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Notification } from "~/components/notification";

const ZLoaderSchema = z.object({
  connectedYoutubeAccountsCount: z.number(),
  googleAuthUrl: z.string(),
  thumbnailJobs: z.array(z.object({})),
  // recentlyPublishedVideo: ZVideoSchema,
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

  return json<LoaderData>({
    connectedYoutubeAccountsCount: count,
    googleAuthUrl: googleAuthUrl,
    thumbnailJobs: [],
    // recentlyPublishedVideo: clientVideo,
  });
};

export const userHomePageActionType = {
  addTest: "addTest",
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");

  let errorWhileParsingForm = {
    error: false,
  } as { error: false } | { error: true; msg: string };

  const fileUploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, name, filename }) => {
      try {
        if (name !== "thumbnails") {
          return undefined;
        }

        if (filename === "") {
          throw new Error("Thumbnails is not specified");
        }

        const fileId = await storeFile(data);

        return JSON.stringify({ id: fileId, contentType: contentType });
      } catch (err) {
        if (err instanceof Error) {
          errorWhileParsingForm = { error: true, msg: err.message };
        } else {
          throw err;
        }
      }
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    fileUploadHandler
  );

  if (errorWhileParsingForm.error) {
    return badRequest(errorWhileParsingForm.msg);
  }
  const actionType = formData.get("actionType");

  if (!actionType || typeof actionType !== "string") {
    return badRequest("Action type is required");
  }

  if (!Object.keys(userHomePageActionType).includes(actionType)) {
    return badRequest("Invalid action type");
  }

  if (actionType === userHomePageActionType.addTest) {
    // TODO: Add action data
    return createAbtest({ formData, userId });
  }
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();
  const isNoAccountPresent = loaderData.connectedYoutubeAccountsCount === 0;
  const transition = useTransition();
  const formRef = useRef<HTMLFormElement | null>(null);
  const actionData = useActionData<BadRequest>();

  const isCreatingTest = transition.type === "actionReload";

  useEffect(() => {
    if (!isCreatingTest) {
      if (!actionData?.errorMessage) {
        formRef.current?.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreatingTest]);

  return (
    <>
      {actionData?.errorMessage ? (
        <div className="notification-panel">
          <Notification error={actionData.errorMessage} />
        </div>
      ) : null}
      <Form
        id="homePageForm"
        className="hero"
        encType="multipart/form-data"
        method="post"
        ref={formRef}
      >
        {" "}
        {isNoAccountPresent ? (
          <div className="no-channel flex">
            <div className="no-channel-card">
              No channel is linked
              <br />
              <a href={loaderData.googleAuthUrl}>Link your youtube Accout</a>
            </div>
          </div>
        ) : (
          <Home />
        )}
      </Form>
    </>
  );
}
