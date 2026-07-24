const LOCAL_FRONTEND_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
]);

export const isAllowedFrontendOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  if (LOCAL_FRONTEND_ORIGINS.has(origin)) return true;
  if (process.env.FRONTEND_URL === origin) return true;

  try {
    const url = new URL(origin);
    return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
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
