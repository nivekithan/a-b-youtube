import type { LoaderFunction } from "@remix-run/server-runtime";
import { removeUserSession } from "~/server/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return removeUserSession(request, "/");
};
