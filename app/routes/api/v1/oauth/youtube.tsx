import type { LoaderFunction} from "@remix-run/server-runtime";
import  { redirect } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const state = searchParams.get("state");

  if (!state) return redirect("/");

  
};
