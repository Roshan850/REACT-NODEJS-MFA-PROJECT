import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // optional
    });
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
