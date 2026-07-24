import redisClient, { ensureRedisConnection } from "../config/redis";

export const getCache = async (key: string): Promise<string | null> => {
  if (!(await ensureRedisConnection())) return null;
  try {
    return await redisClient.get(key);
  } catch {
    return null;
  }
};

export const setCache = async (
  key: string,
  value: unknown,
  expiry = 3600
): Promise<void> => {
  if (!(await ensureRedisConnection())) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: expiry });
  } catch {
    // Cache failures must not fail the underlying request.
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  if (!(await ensureRedisConnection())) return;
  try {
    await redisClient.del(key);
  } catch {
    // Cache failures must not fail the underlying request.
  }
};
