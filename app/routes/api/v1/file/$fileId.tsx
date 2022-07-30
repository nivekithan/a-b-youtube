import type { LoaderFunction } from "@remix-run/server-runtime";
import { getFileStream } from "~/server/storage.server";

export const loader: LoaderFunction = async ({ request, params }) => {
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
