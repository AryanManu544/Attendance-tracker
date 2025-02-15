const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins (for development)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

// Ensure the database connects before handling requests
connectToMongo();

module.exports = app; // Export app for Vercel
