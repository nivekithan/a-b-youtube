import type { LoaderFunction } from "@remix-run/server-runtime";
import { getUserFromUserId, requireUserId } from "~/models/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const user = await getUserFromUserId(userId);

  return null;
};

export default function RenderUserHomePage() {
  return <div>This is user Home page</div>;
}
