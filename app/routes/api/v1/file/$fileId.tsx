import type { LoaderFunction } from "@remix-run/server-runtime";
import { requireUserId } from "~/models/user.server";
import { getFileStream } from "~/server/storage.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request, "/");

  const fileId = params.fileId;

  if (fileId === undefined) {
    throw new Error("File id is undefined");
  }

  const fileReadable = await getFileStream(fileId);

  const response = new Response(fileReadable, {
    headers: { "Content-Type": "image/jpeg" },
  });

  return response;
};
