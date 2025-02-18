const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Timetable = require("../models/Timetable");

// Create a new timetable entry
router.post("/", fetchuser, async (req, res) => {
  try {
    const { day, time, subject } = req.body;
    const entry = new Timetable({
      student: req.user.id,
      day,
      time,
      subject,
    });
    const savedEntry = await entry.save();
    res.json(savedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get timetable entries for the logged-in user
router.get("/", fetchuser, async (req, res) => {
  try {
    const entries = await Timetable.find({ student: req.user.id });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching timetable entries:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;