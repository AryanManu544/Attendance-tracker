const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");

// Route 1: Mark Attendance - POST /api/attendance/mark
// (User must be logged in; token is verified via fetchuser middleware)
router.post('/mark', fetchuser, [
    body('className', 'Class name is required').notEmpty(),
    body('status', 'Status must be either present or absent').isIn(['present', 'absent']),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Create an attendance record using the logged-in user's id
        const attendanceRecord = new Attendance({
            student: req.user.id,
            className: req.body.className,
            status: req.body.status
        });
        const savedRecord = await attendanceRecord.save();
        res.json(savedRecord);
    } catch (error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// Route 2: Get Attendance - GET /api/attendance/view
// (Returns all attendance records for the logged-in user)
router.get('/view', fetchuser, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ student: req.user.id });
        res.json(attendanceRecords);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
