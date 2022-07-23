import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { generateGoogleSignUpUrl } from "~/models/google.server";
import { getUserId } from "~/models/user.server";
import { z } from "zod";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Box,
  Button,
  Container,
  Link as MUILink,
  Stack,
  Typography,
} from "@mui/material";

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
    <Container>
      <Box className="min-h-screen grid place-items-center">
        <Stack className="gap-y-4 items-center">
          <Typography variant="h4" align="center">
            Welcome to Youtube A/B Testing
          </Typography>
          <Typography>
            Don't have an account?{" "}
            <MUILink href={loaderData.googleAuthUrl}>sign up for free</MUILink>
          </Typography>
          <Typography className="text-sm mt-2 gap-y-2 flex flex-col">
            <Button
              component="a"
              variant="contained"
              href={loaderData.googleAuthUrl}
              className="rounded-lg px-20 py-2 normal-case"
            >
              Continue with google
            </Button>
            <Button
              component={Link}
              to="/api/v1/guestLogin"
              variant="outlined"
              color="secondary"
              className="rounded-lg py-2 normal-case"
            >
              Continue with guest account
            </Button>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}

export const meta: MetaFunction = () => ({
  title: "Login | Youtube A/B Testing",
});
