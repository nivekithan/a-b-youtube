import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { getUserId } from "~/models/user.server";
import { z } from "zod";
import { useLoaderData } from "@remix-run/react";
import { Signin } from "~/components/signin";

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

  return <Signin googleAuthUrl={loaderData.googleAuthUrl} />;
}

export const meta: MetaFunction = () => ({
  title: "Login | Youtube A/B Testing",
});
