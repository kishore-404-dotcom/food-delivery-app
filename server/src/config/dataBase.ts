import mongoose from "mongoose";

import { MONGODB_URI } from "./env";
import logger from "./logger";

const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(MONGODB_URI);
  logger.info("MongoDB connected");
};

export default connectDB;
