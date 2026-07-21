import app from "./app";
import connectDB from "./config/dataBase";
import { PORT } from "./config/env";
import "./workers/emailWorker";
import "./cron/cronJobs";
import logger from "./config/logger";

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();