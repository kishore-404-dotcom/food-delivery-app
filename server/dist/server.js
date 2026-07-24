"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const dataBase_1 = __importDefault(require("./config/dataBase"));
const env_1 = require("./config/env");
require("./workers/emailWorker");
require("./cron/cronJobs");
const logger_1 = __importDefault(require("./config/logger"));
const socket_1 = require("./socket");
const httpServer = (0, http_1.createServer)(app_1.default);
(0, socket_1.initializeSocket)(httpServer);
async function startServer() {
    try {
        await (0, dataBase_1.default)();
        httpServer.listen(env_1.PORT, () => {
            logger_1.default.info(`🚀 Server running on port ${env_1.PORT}`);
        });
    }
    catch (error) {
        logger_1.default.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
