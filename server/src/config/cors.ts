import { FRONTEND_URL, FRONTEND_URLS, NODE_ENV } from "./env";

const LOCAL_FRONTEND_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
]);

export const isAllowedFrontendOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  if (FRONTEND_URL === origin) return true;
  if (FRONTEND_URLS.includes(origin)) return true;
  return NODE_ENV !== "production" && LOCAL_FRONTEND_ORIGINS.has(origin);
};

export const frontendOriginCallback = (
  origin: string | undefined,
  callback: (error: Error | null, allowed?: boolean) => void
) => {
  if (isAllowedFrontendOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error("CORS policy violation"));
};
