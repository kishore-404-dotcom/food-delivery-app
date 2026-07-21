import { RedisOptions } from "ioredis";
import { REDIS_URL } from "./env";

const redisUrl = new URL(REDIS_URL);

export const redisConnection: RedisOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  username: redisUrl.username || "default",
  password: redisUrl.password,
  tls: redisUrl.protocol === "rediss:" ? {} : undefined,
  maxRetriesPerRequest: null,
};