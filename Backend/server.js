const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS (consider restricting origins in production)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// Database Connection Setup
const mongoURI = process.env.MONGO_URI || "mongodb+srv://aryanmanu544:ary1nay2@aryanmanu.pvkla.mongodb.net/Attendance_tracker?retryWrites=true&w=majority";

// Connection configuration optimized for serverless
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Control connection pool size
      heartbeatFrequencyMS: 30000,
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Fail fast in production
  }
};

// Serverless-friendly connection handling
if (process.env.NODE_ENV !== "production") {
  // Immediate connect for development
  connectDB();
} else {
  // Connect when first request comes in for serverless
  app.use(async (req, res, next) => {
    await connectDB();
    next();
  });
}

// API Routes with timeout protection
const timeout = (ms) => (req, res, next) => {
  res.setTimeout(ms, () => {
    res.status(504).json({ error: "Request timeout" });
  });
  next();
};

// Apply 9-second timeout to all routes (keep under Vercel's 10s limit)
app.use(timeout(9000));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});

module.exports = app;