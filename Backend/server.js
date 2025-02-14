// server.js
const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins (for development)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token"]
}));

// API Routes
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/attendance', require('./routes/attendance')); 

// Connect to MongoDB and start the server
connectToMongo();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
