import { google } from "googleapis";
import { getEnvVar } from "~/server/utils.server";

export const getGoogleOAuthClient = () => {
  const googleOAuthClient = new google.auth.OAuth2(
    getEnvVar("GOOGLE_API_CLIENT_ID"),
    getEnvVar("GOOGLE_API_CLIENT_SECRET"),
    getEnvVar("GOOGLE_API_REDIRECT_URI")
  );

  return googleOAuthClient;
};

export type GenerateGoogleSignUpUrlProps = {
  youtube?: boolean;
  profile?: boolean;
};

/**
 * Generates a url through which users can authenticate their
 * google account
 */
export const generateGoogleSignUpUrl = ({
  youtube,
  profile,
}: GenerateGoogleSignUpUrlProps = {}) => {
  const googleOAuthClient = getGoogleOAuthClient();
  const scopes = [];

  if (youtube) {
    scopes.push(
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.upload"
    );
  }

  if (profile) {
    scopes.push("openid email profile");
  }

  const authorizationUrl = googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  return authorizationUrl;
};
