"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const env_1 = require("./env");
const redisUrl = new URL(env_1.REDIS_URL);
exports.redisConnection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    username: redisUrl.username || "default",
    password: redisUrl.password,
    tls: redisUrl.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
};
