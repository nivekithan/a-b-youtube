import { prisma } from "~/db.server";
import type { TUser } from "./user.server";
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

export const refreshToken = async (user: TUser) => {
  const oAuthClient = getGoogleOAuthClient();

  oAuthClient.setCredentials({
    access_token: user.oauthToken,
    refresh_token: user.refreshToken,
  });

  const res = await oAuthClient.refreshAccessToken();

  const newAccessToken = res.credentials.access_token;

  if (newAccessToken === undefined || newAccessToken === null) {
    throw new Error(`Could not refresh access token`);
  }

  user.oauthToken = newAccessToken;

  await prisma.oAuthToken.update({
    data: { token: newAccessToken },
    where: { userId: user.userId },
  });
};
