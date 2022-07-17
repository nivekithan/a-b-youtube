import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { requireUserId } from "~/models/user.server";
import { getCountOfConnectedYoutubeAccounts } from "~/models/youtubeAccount.server";

const ZLoaderSchema = z.object({
  connectedYoutubeAccounts: z.number(),
  googleAuthUrl: z.string(),
});

type LoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request, "/");
  const count = await getCountOfConnectedYoutubeAccounts(userId);

  const googleAuthUrl = generateGoogleSignUpUrl({ scopes: { youtube: true } });

  return json<LoaderData>({
    connectedYoutubeAccounts: count,
    googleAuthUrl: googleAuthUrl,
  });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderUserHomePage() {
  const loaderData = useZLoaderData();

  return (
    <div className="h-screen w-full grid place-items-center">
      <a
        className="border-[3px] border-black px-14 py-2 rounded-md"
        href={loaderData.googleAuthUrl}
      >
        Connect your youtube account
      </a>
    </div>
  );
}
