import { config } from "dotenv";

export const getEnv = (env: string, def?: string) => {
  config();
  const val = process.env[env];
  if (!val) {
    if (!def) throw new Error(`Environment var not set: ${env}`);
    return def;
  }
  return val;
};
