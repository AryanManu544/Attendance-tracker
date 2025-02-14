// routes/auth.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Your User model
const router = express.Router();

const JWT_SECRET = "Splendid_Ganesha"; // Ideally store this in an .env file

// ROUTE: Create a user using POST "/api/auth/createuser" - No login required
router.post(
  "/createuser",
  [
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user already exists
      let existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create the user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // Create JWT token
      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.status(200).json({ authtoken });
    } catch (error) {
      console.error("Error in /createuser:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Route 2: Login existing user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const payload = { user: { id: user._id } };
      const authtoken = jwt.sign(payload, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error("Error in /login:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
