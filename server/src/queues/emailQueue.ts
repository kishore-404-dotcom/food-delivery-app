import { Queue } from "bullmq";

import { redisConnection } from "../config/bullmq";

export const emailQueue = new Queue(
  "email-queue",
  {
    connection: redisConnection,
  }
);