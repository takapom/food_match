// Application configuration

export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Food Matching",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    env: process.env.NODE_ENV || "development",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 10000,
  },
  auth: {
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
    cookieName: "auth-token",
  },
} as const;

export const isDevelopment = config.app.env === "development";
export const isProduction = config.app.env === "production";