import React, { useState, useEffect } from "react";
import axios from "axios";

const Timetable = ({ mode, showalert }) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = daysOfWeek[new Date().getDay()];

  // State to hold timetable entries fetched from backend
  const [timetableEntries, setTimetableEntries] = useState([]);
  // State for new entry form
  const [newEntry, setNewEntry] = useState({
    day: "Monday",
    time: "",
    subject: "",
  });
  // State to track attendance
  const [attendance, setAttendance] = useState({});

  // Use your backend URL deployed on Render
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://your-backend-url.com";

  // Fetch timetable entries for the logged-in user from the backend
  useEffect(() => {
    const fetchTimetableEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showalert("You must be logged in to view the timetable.", "danger");
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/timetable`, {
          headers: { "auth-token": token },
        });
        setTimetableEntries(response.data);
      } catch (error) {
        console.error("Error fetching timetable entries:", error);
        showalert("Error fetching timetable entries.", "danger");
      }
    };

    fetchTimetableEntries();
  }, [API_BASE_URL, showalert]);

  // Handler for input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the new timetable entry to the backend
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.time || !newEntry.subject) {
      showalert("Please fill in all fields.", "danger");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showalert("You must be logged in to add an entry.", "danger");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/timetable`,
        newEntry,
        { headers: { "auth-token": token } }
      );
      // Update state with the new entry
      setTimetableEntries((prev) => [...prev, response.data]);
      setNewEntry({ day: "Monday", time: "", subject: "" });
      showalert("Timetable entry added successfully!", "success");
    } catch (error) {
      console.error("Error adding timetable entry:", error);
      showalert("Error adding timetable entry.", "danger");
    }
  };

  // Filter and display only today's events
  const todaysEntries = timetableEntries.filter(
    (entry) => entry.day === today
  );

  // Mark attendance for an entry (only subject is stored for attendance)
  const markAttendance = async (entry) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showalert("You must be logged in to mark attendance.", "danger");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/attendance/mark`,
        {
          className: entry.subject, // Only the subject is stored
          status: "present",
        },
        { headers: { "auth-token": token } }
      );
      if (response.data) {
        showalert("Attendance marked successfully!", "success");
        setAttendance((prev) => ({
          ...prev,
          [entry.subject]: true,
        }));
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      showalert("Error marking attendance.", "danger");
    }
  };

  return (
    <div
      className={`container ${mode === "dark" ? "text-light" : ""}`}
      style={{
        marginTop: "4rem",
        padding: "2rem",
        backgroundColor: mode === "dark" ? "#222222" : "#ffffff",
        borderRadius: "8px",
        boxShadow:
          mode === "dark"
            ? "0px 4px 10px rgba(0,0,0,0.8)"
            : "0px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      <h2 className="text-center">Timetable</h2>

      {/* Form to add a new timetable entry */}
      <form onSubmit={handleAddEntry} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <select
              name="day"
              className="form-select"
              value={newEntry.day}
              onChange={handleInputChange}
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="time"
              className="form-control"
              placeholder="Time (e.g., 9:00 - 9:50)"
              value={newEntry.time}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Class Name"
              value={newEntry.subject}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Add Entry
            </button>
          </div>
        </div>
      </form>

      {/* Display Today's Classes */}
      <h3 className="text-center">Today's Classes ({today})</h3>
      {todaysEntries.length > 0 ? (
        <ul className="list-group">
          {todaysEntries.map((entry, index) => (
            <li
              key={index}
              className={`list-group-item ${
                mode === "dark" ? "bg-dark text-light" : ""
              }`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: mode === "dark" ? "#444444" : "#dddddd",
              }}
            >
              <div>
                <strong>{entry.time}</strong> - {entry.subject}
              </div>
              <button
                className="btn btn-outline-success"
                onClick={() => markAttendance(entry)}
                disabled={attendance[entry.subject]}
              >
                {attendance[entry.subject] ? "Marked" : "Mark Attendance"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No classes scheduled for today!</p>
      )}
    </div>
  );
};

export default Timetable;