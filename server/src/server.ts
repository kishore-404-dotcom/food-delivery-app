import app from "./app";
import connectDB from "./config/dataBase";
import { PORT } from "./config/env";
import "./workers/emailWorker";
import "./cron/cronJobs";
import logger from "./config/logger";

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});