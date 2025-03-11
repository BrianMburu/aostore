import { AppInfo } from "@othent/kms";

export const appInfo: AppInfo = {
  name: "aostore",
  version: "1.0.0",
  env: process.env.NODE_ENV === "production" ? "production" : "development",
};

export const TokenExpiry = 7 * 24 * 60 * 60 * 1000;