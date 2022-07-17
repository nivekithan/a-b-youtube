import { google } from "googleapis";
import { getEnvVar } from "~/server/utils.server";

export const getGoogleOAuthClient = ({
  redirectUrl,
}: { redirectUrl?: string } = {}) => {
  const googleOAuthClient = new google.auth.OAuth2(
    getEnvVar("GOOGLE_API_CLIENT_ID"),
    getEnvVar("GOOGLE_API_CLIENT_SECRET"),
    redirectUrl ?? getEnvVar("GOOGLE_API_REDIRECT_URI")
  );

  return googleOAuthClient;
};

export type GenerateGoogleSignUpUrlProps = {
  scopes: {
    youtube?: boolean;
    profile?: boolean;
  };
  state?: string;
  redirectUrl?: string;
};

/**
 * Generates a url through which users can authenticate their
 * google account
 */
export const generateGoogleSignUpUrl = (
  { scopes, redirectUrl, state }: GenerateGoogleSignUpUrlProps = { scopes: {} }
) => {
  const googleOAuthClient = getGoogleOAuthClient();
  const { profile = false, youtube = false } = scopes;
  const scopesUrl = [];

  if (youtube) {
    scopesUrl.push(
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.upload"
    );
  }

  if (profile) {
    scopesUrl.push("openid email profile");
  }

  const authorizationUrl = googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: scopesUrl,
    include_granted_scopes: true,
    redirect_uri: redirectUrl ?? undefined,
    state: state ?? undefined,
  });

  return authorizationUrl;
};
