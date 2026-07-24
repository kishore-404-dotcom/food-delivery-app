import { createClient } from "redis";

import { REDIS_URL } from "./env";
import logger from "./logger";

const redisClient = createClient(REDIS_URL ? { url: REDIS_URL } : {});

redisClient.on("error", (error) => {
  logger.warn(
    `Redis cache unavailable: ${error instanceof Error ? error.message : "unknown error"}`
  );
});

let connectionPromise: Promise<boolean> | null = null;

export const ensureRedisConnection = async (): Promise<boolean> => {
  if (!REDIS_URL) return false;
  if (redisClient.isReady) return true;
  if (connectionPromise) return connectionPromise;

  connectionPromise = redisClient
    .connect()
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient.isOpen) await redisClient.quit();
};

export default redisClient;
