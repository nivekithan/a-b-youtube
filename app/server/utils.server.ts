import { json } from "@remix-run/server-runtime";
import { google } from "googleapis";

export const getGoogleOAuthClient = () => {
  const googleOAuthClient = new google.auth.OAuth2(
    getEnvVar("GOOGLE_API_CLIENT_ID"),
    getEnvVar("GOOGLE_API_CLIENT_SECRET"),
    getEnvVar("GOOGLE_API_REDIRECT_URI")
  );

  return googleOAuthClient;
};

/**
 * Generates a url through which users can authenticate their
 * google account
 */
export const generateGoogleSignUpUrl = () => {
  const googleOAuthClient = getGoogleOAuthClient();

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "openid email profile",
  ];

  const authorizationUrl = googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  return authorizationUrl;
};

export const badRequest = <Data = unknown>(data: Data) => {
  return json(data, { status: 401 });
};

export type EnvVarNames =
  | "GOOGLE_API_CLIENT_ID"
  | "GOOGLE_API_CLIENT_SECRET"
  | "GOOGLE_API_REDIRECT_URI";

export const getEnvVar = (varName: EnvVarNames): string => {
  const envVarValue = process.env[varName];

  if (!envVarValue) {
    throw new Error(`Missing environment variable ${varName}`);
  }

  return envVarValue;
};
