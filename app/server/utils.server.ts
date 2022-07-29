import { json } from "@remix-run/server-runtime";
import { SimpleCrypto } from "simple-crypto-js";

export const badRequest = <Data = unknown>(data: Data) => {
  return json(data, { status: 401 });
};

export type EnvVarNames =
  | "GOOGLE_API_CLIENT_ID"
  | "GOOGLE_API_CLIENT_SECRET"
  | "GOOGLE_API_REDIRECT_URI"
  | "SESSION_SECRET"
  | "SIMPLE_CRYPTO_SECRET"
  | "DATABASE_URL"
  | "NODE_ENV"
  | "REDIS_HOST";

export const getEnvVar = (varName: EnvVarNames): string => {
  const envVarValue = process.env[varName];

  if (!envVarValue) {
    throw new Error(`Missing environment variable ${varName}`);
  }

  return envVarValue;
};

const EncryptHandler = new SimpleCrypto(getEnvVar("SIMPLE_CRYPTO_SECRET"));

export const encrypt = (value: string): string => {
  return EncryptHandler.encrypt(value);
};

export const decrypt = (encryptedValue: string): string => {
  const value = EncryptHandler.decrypt(encryptedValue);

  if (typeof value !== "string") {
    throw new Error(
      `Expected encryptedValue to be only string but instead got ${typeof value}`
    );
  }

  return value;
};
