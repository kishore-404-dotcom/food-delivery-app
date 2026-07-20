import { createClient } from "redis";

import { REDIS_URL } from "./env";

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

redisClient.connect();

export default redisClient;