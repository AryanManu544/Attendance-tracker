import React, { useState, useEffect } from "react";
import axios from "axios";

const MarkMonthlyAttendance = ({ mode, showalert }) => {
  const [subjects, setSubjects] = useState([]); 
  const [selectedSubject, setSelectedSubject] = useState(""); 
  const [dates, setDates] = useState([]); 
  const [attendance, setAttendance] = useState({}); 

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

  // Fetch subjects from timetable on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/timetable`, {
          headers: { "auth-token": token },
        });
        const uniqueSubjects = [
          ...new Set(response.data.map((entry) => entry.subject)),
        ];
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        showalert("Error fetching subjects.", "danger");
      }
    };

    fetchSubjects();
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

      const markedDates = attendanceResponse.data.map((record) =>
        new Date(record.date).toISOString().split("T")[0]
      );

      // Generate all dates in the current month
      const currentMonthDates = [];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      for (
        let day = 1;
        day <= new Date(year, month + 1, 0).getDate();
        day++
      ) {
        currentMonthDates.push(
          new Date(year, month, day).toISOString().split("T")[0]
        );
      }

      setDates(
        currentMonthDates.map((date) => ({
          date,
          marked: markedDates.includes(date),
        }))
      );
    } catch (error) {
      console.error("Error fetching dates:", error);
      showalert("Error fetching dates.", "danger");
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (date) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Submit marked attendance
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const markedDates = Object.keys(attendance).filter(
        (date) => attendance[date]
      );

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
            {dates.map(({ date, marked }) => (
              <li key={date} className="list-group-item">
                <input
                  type="checkbox"
                  checked={attendance[date] || marked}
                  onChange={() => handleCheckboxChange(date)}
                />
                <label style={{ marginLeft: "10px" }}>{date}</label>
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