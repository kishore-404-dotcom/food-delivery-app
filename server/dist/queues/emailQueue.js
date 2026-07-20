"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const bullmq_2 = require("../config/bullmq");
exports.emailQueue = new bullmq_1.Queue("email-queue", {
    connection: bullmq_2.redisConnection,
});
