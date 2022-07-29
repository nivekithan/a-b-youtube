import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { VideoRecord } from "~/components/videoRecord";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const jobId = searchParams.get("jobId");

  return json({ jobId: jobId });
};

export default function RenderVideoRecord() {
  const loaderData = useLoaderData();

  // console.log(loaderData.jobId);
  return <VideoRecord />;
}
