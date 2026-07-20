import { Worker } from "bullmq";

import { redisConnection } from "../config/bullmq";

const emailWorker = new Worker(
  "email-queue",

  async (job) => {
    const { email, subject } = job.data;

    console.log("Sending Email...");
    console.log(email);
    console.log(subject);

    // Actual email logic will be added later
  },

  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", () => {
  console.log("Email Job Completed");
});

emailWorker.on("failed", () => {
  console.log("Email Job Failed");
});