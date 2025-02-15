// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
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

// Connect to MongoDB
const mongoURI = 'mongodb+srv://aryanmanu544:ary1nay2@aryanmanu.pvkla.mongodb.net/Attendance_tracker'; 

const connectToMongo = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};
connectToMongo();
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//test run