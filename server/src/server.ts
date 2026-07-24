import { createServer } from "http";
import mongoose from "mongoose";

import app from "./app";
import connectDB from "./config/dataBase";
import { closeRedis } from "./config/redis";
import { PORT, validateEnvironment } from "./config/env";
import logger from "./config/logger";
import { initializeSocket } from "./socket";

const httpServer = createServer(app);
const socketServer = initializeSocket(httpServer);
let shuttingDown = false;

async function startServer(): Promise<void> {
  try {
    validateEnvironment();
    await connectDB();

    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(
      `Failed to start server: ${error instanceof Error ? error.message : "unknown error"}`
    );
    process.exit(1);
  }
}

const shutdown = async (signal: string): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received; shutting down gracefully`);

  const forceExit = setTimeout(() => {
    logger.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  socketServer.close();
  await new Promise<void>((resolve) => httpServer.close(() => resolve()));
  await Promise.allSettled([closeRedis(), mongoose.disconnect()]);

  clearTimeout(forceExit);
  process.exit(0);
};

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

void startServer();
