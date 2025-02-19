import React, { useState, useEffect } from "react";
import axios from "axios";

const MarkMonthlyAttendance = ({ mode, showalert }) => {
  const [subjects, setSubjects] = useState([]); // List of subjects
  const [selectedSubject, setSelectedSubject] = useState(""); // Selected subject
  const [dates, setDates] = useState([]); // Dates of the selected subject
  const [attendance, setAttendance] = useState({}); // Attendance state
  const [timetable, setTimetable] = useState([]); // Timetable data

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

  // Fetch timetable and subjects on mount
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/timetable`, {
          headers: { "auth-token": token },
        });
        setTimetable(response.data);

        // Extract unique subjects from timetable
        const uniqueSubjects = [
          ...new Set(response.data.map((entry) => entry.subject)),
        ];
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching timetable:", error);
        showalert("Error fetching timetable.", "danger");
      }
    };

    fetchTimetable();
  }, [API_BASE_URL, showalert]);

  // Fetch dates for the selected subject
  const handleSubjectChange = async (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);

    if (!subject) return;

    try {
      const token = localStorage.getItem("token");

      // Fetch attendance records for the selected subject
      const attendanceResponse = await axios.get(
        `${API_BASE_URL}/api/attendance/view/${subject}`,
        { headers: { "auth-token": token } }
      );

      const markedDates = attendanceResponse.data.reduce((acc, record) => {
        acc[record.date] = record.status; // Store status ("present" or "absent")
        return acc;
      }, {});

      // Filter timetable entries for this subject
      const subjectEntries = timetable.filter(
        (entry) => entry.subject === subject
      );

      // Generate all dates in the current month that match the schedule
      const currentMonthDates = [];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      for (
        let day = 1;
        day <= new Date(year, month + 1, 0).getDate();
        day++
      ) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.toLocaleString("en-US", { weekday: "long" });

        // Check if this date matches any day in the timetable
        if (subjectEntries.some((entry) => entry.day === dayOfWeek)) {
          currentMonthDates.push({
            date: dateObj.toISOString().split("T")[0],
            status: markedDates[dateObj.toISOString().split("T")[0]] || null,
          });
        }
      }

      setDates(currentMonthDates);
    } catch (error) {
      console.error("Error fetching dates:", error);
      showalert("Error fetching dates.", "danger");
    }
  };

  // Toggle attendance status between "present", "absent", and null
  const toggleStatus = (date) => {
    setAttendance((prev) => ({
      ...prev,
      [date]:
        prev[date] === "present"
          ? "absent"
          : prev[date] === "absent"
          ? null
          : "present",
    }));
  };

  // Submit marked attendance
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const markedDates = Object.keys(attendance).map((date) => ({
        date,
        status: attendance[date],
      }));

      await axios.post(
        `${API_BASE_URL}/api/attendance/mark-multiple`,
        { className: selectedSubject, dates: markedDates },
        { headers: { "auth-token": token } }
      );

      showalert("Attendance marked successfully!", "success");
    } catch (error) {
      console.error("Error marking attendance:", error);
      showalert("Error marking attendance.", "danger");
    }
  };

  return (
    <div
      className={`container ${mode === "dark" ? "text-light" : ""}`}
      style={{
        maxWidth: "600px",
        margin: "4rem auto",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: mode === "dark" ? "#222222" : "#ffffff",
        boxShadow:
          mode === "dark"
            ? "0px 4px 10px rgba(0,0,0,0.8)"
            : "0px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h2 className="text-center">Mark Monthly Attendance</h2>

      {/* Subject Dropdown */}
      <div className="mb-3">
        <label htmlFor="subject" className="form-label">
          Select Subject
        </label>
        <select
          id="subject"
          className="form-select"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Dates Checkboxes */}
      {dates.length > 0 && (
        <div>
          <h5>Mark Attendance</h5>
          <ul className="list-group">
            {dates.map(({ date, status }) => (
              <li key={date} className="list-group-item">
                <span
                  style={{
                    cursor: "pointer",
                    color:
                      attendance[date] === "present" || status === "present"
                        ? "green"
                        : attendance[date] === "absent" || status === "absent"
                        ? "red"
                        : "",
                  }}
                  onClick={() => toggleStatus(date)}
                >
                  {attendance[date] === "present" || status === "present"
                    ? `✅ ${date}`
                    : attendance[date] === "absent" || status === "absent"
                    ? `❌ ${date}`
                    : `${date}`}
                </span>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
            disabled={!selectedSubject}
          >
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkMonthlyAttendance;