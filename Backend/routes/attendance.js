const express = require("express");
const { body, validationResult } = require("express-validator");
const Attendance = require("../models/Attendance");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

// Route to mark attendance for the logged-in user
router.post(
  "/mark",
  fetchuser,
  [
    body("className", "Class name is required").notEmpty(),
    body("status", "Status must be either present or absent").isIn(["present", "absent"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Create a new attendance record linked to the logged-in user
      const attendanceRecord = new Attendance({
        student: req.user.id,
        className: req.body.className,
        status: req.body.status,
      });
      const savedRecord = await attendanceRecord.save();
      res.json(savedRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Route to fetch attendances for the logged-in user
router.get("/view", fetchuser, async (req, res) => {
  try {
    // Find attendance records only for the current user
    const attendanceRecords = await Attendance.find({ student: req.user.id });
    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
