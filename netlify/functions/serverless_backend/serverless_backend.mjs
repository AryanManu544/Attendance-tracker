import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";
import authRoutes from "../../backend/routes/auth.js";
import attendanceRoutes from "../../backend/routes/attendance.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// MongoDB Connection (optimized for serverless)
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://aryanmanu544:ary1nay2@aryanmanu.pvkla.mongodb.net/Attendance_tracker";

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        heartbeatFrequencyMS: 30000,
      });
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
};

// Connect DB only when a request is received
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

export const handler = serverless(app);
