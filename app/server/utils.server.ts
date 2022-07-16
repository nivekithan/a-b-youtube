import { json } from "@remix-run/server-runtime";

export const badRequest = <Data = unknown>(data: Data) => {
  return json(data, { status: 401 });
};

export type EnvVarNames =
  | "GOOGLE_API_CLIENT_ID"
  | "GOOGLE_API_CLIENT_SECRET"
  | "GOOGLE_API_REDIRECT_URI"
  | "SESSION_SECRET";

export const getEnvVar = (varName: EnvVarNames): string => {
  const envVarValue = process.env[varName];

  if (!envVarValue) {
    throw new Error(`Missing environment variable ${varName}`);
  }

  return envVarValue;
};
