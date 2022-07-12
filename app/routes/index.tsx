import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { getUserFromUserId, requireUserId } from "~/models/user.server";
import type {
  TVideo} from "~/models/videos.server";
import {
  getLatestVideosInPlaylist,
  getUploadPlaylistId
} from "~/models/videos.server";
import { getUserSession, removeUserSession } from "~/server/session.server";
import { badRequest, generateGoogleSignUpUrl } from "~/server/utils.server";

const validActionTypes = {
  connectGoogle: "connectGoogle",
  logout: "logout",
  getListOfVideos: "getListOfVideos",
};

type ActionData = {
  errorMessage?: string;
  listOfVideos?: TVideo[];
};

type LoaderData = {
  isLogedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await getUserSession(request);
  const userId = userSession.get("userId");

  if (!userId || typeof userId !== "string")
    return json<LoaderData>({ isLogedIn: false });

  return json<LoaderData>({ isLogedIn: true });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const actionType = formData.get("actionType");

  if (actionType === null || typeof actionType !== "string") {
    return badRequest<ActionData>({
      errorMessage: `Parameter actionType is missing`,
    });
  }

  if (!(actionType in validActionTypes))
    return badRequest<ActionData>({
      errorMessage: `Unknown actionType ${actionType}`,
    });

  if (actionType === validActionTypes.connectGoogle) {
    const redirectUrl = generateGoogleSignUpUrl();
    return redirect(redirectUrl);
  } else if (actionType === validActionTypes.logout) {
    return await removeUserSession(request, "/");
  } else if (actionType === validActionTypes.getListOfVideos) {
    const userId = await requireUserId(request, "/");
    const user = await getUserFromUserId(userId);
    const currentUserUploadsPlaylistId = await getUploadPlaylistId(user);

    if (currentUserUploadsPlaylistId === null) return json<ActionData>({errorMessage : `Could not upload playlist id`}) ;

    const videos = await getLatestVideosInPlaylist(
      user,
      currentUserUploadsPlaylistId
    );

    if (videos === null) return json<ActionData>({errorMessage : `Could not get videos`}) ;
     
    return json<ActionData>({listOfVideos : videos})

  }
};

export default function Index() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  const isLoggedIn = loaderData.isLogedIn;

  return (
    <div>
      <p>User {isLoggedIn ? "is logged in" : "is not logged in"}</p>
      <Form className="m-5 flex gap-x-8" method="post">
        <button
          name="actionType"
          value={validActionTypes.connectGoogle}
          className="bg-blue-800 text-white px-3 py-2 rounded-md"
        >
          Verify with Google
        </button>

        <button
          name="actionType"
          value={validActionTypes.logout}
          className="bg-red-800 text-white px-3 py-2 rounded-md"
        >
          Logout
        </button>

        <button
          className="bg-blue-800 text-white px-3 py-2 rounded-md"
          name="actionType"
          value={validActionTypes.getListOfVideos}
        >
          Get the list of videos
        </button>
      </Form>
      <pre>
        {JSON.stringify(actionData, null, 2)}
      </pre>
    </div>
  );
}
