"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const bullmq_2 = require("../config/bullmq");
const emailWorker = new bullmq_1.Worker("email-queue", async (job) => {
    const { email, subject } = job.data;
    console.log("Sending Email...");
    console.log(email);
    console.log(subject);
    // Actual email logic will be added later
}, {
    connection: bullmq_2.redisConnection,
});
emailWorker.on("completed", () => {
    console.log("Email Job Completed");
});
emailWorker.on("failed", () => {
    console.log("Email Job Failed");
});
