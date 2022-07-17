import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { getUserId } from "~/models/user.server";
import { z } from "zod";
import { useLoaderData } from "@remix-run/react";

const ZLoaderSchema = z.object({ googleAuthUrl: z.string() });

type LoaderData = z.infer<typeof ZLoaderSchema>;

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId !== null) {
    // Then the user is already logged in
    // redirect the user to home page
    return redirect(`/user/${userId}`);
  }

  const googleAuthVerifyUrl = generateGoogleSignUpUrl({
    scopes: { profile: true },
  });
  return json<LoaderData>({ googleAuthUrl: googleAuthVerifyUrl });
};

const useZLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return ZLoaderSchema.parse(loaderData);
};

export default function RenderHomePage() {
  const loaderData = useZLoaderData();

  return (
    <div className="h-screen w-screen grid place-items-center">
      <a
        href={loaderData.googleAuthUrl}
        className="border-[3px] border-black font-bold px-14 rounded-md py-2 "
      >
        Connect through Google
      </a>
    </div>
  );
}
