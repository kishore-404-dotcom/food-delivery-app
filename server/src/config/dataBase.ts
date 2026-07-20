import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

// Connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Check MongoDB URI
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;