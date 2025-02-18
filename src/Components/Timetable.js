import React, { useState, useEffect } from "react";
import axios from "axios";

const Timetable = ({ mode, showalert }) => {
  // Timetable data based on your provided image
  const timetable = {
    Monday: [
      { time: "9:00 - 9:50", subject: "CO102 (Lab)" },
      { time: "10:00 - 10:50", subject: "MC106" },
      { time: "11:00 - 11:50", subject: "MC106" },
      { time: "2:00 - 2:50", subject: "MC104" },
      { time: "3:00 - 3:50", subject: "MC104" },
    ],
    Tuesday: [
      { time: "9:00 - 9:50", subject: "AEC/VAC" },
      { time: "11:00 - 11:50", subject: "MC106" },
      { time: "2:00 - 2:50", subject: "CO102" },
    ],
    Wednesday: [
      { time: "10:00 - 10:50", subject: "MC106" },
      { time: "12:00 - 12:50", subject: "MC102" },
    ],
    Thursday: [
      { time: "9:00 - 9:50", subject: "AEC/VAC" },
      { time: "11:00 - 11:50", subject: "MC106 (Lab)" },
    ],
    Friday: [
      { time: "9:00 - 9:50", subject: "MC106 (Lab)" },
      { time: "2:00 - 2:50", subject:"CO102"},
    ],
  };

  // Get today's day
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = daysOfWeek[new Date().getDay()];

  // State to track attendance for the logged-in user
  const [attendance, setAttendance] = useState({});

  // Fetch attendance data for the logged-in user
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
        const token = localStorage.getItem("token");

        if (!token) {
          showalert("You must be logged in to view attendance.", "danger");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/attendance/view`, {
          headers: { 'auth-token': token },
        });

        // Map attendance data to a state object
        const userAttendance = {};
        response.data.forEach((record) => {
          userAttendance[record.className] = true;
        });

        setAttendance(userAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        showalert("Error fetching attendance.", "danger");
      }
    };

    fetchAttendance();
  }, [showalert]);

  // Mark attendance for a class
  const markAttendance = async (classInfo) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
      const token = localStorage.getItem("token");

      if (!token) {
        showalert("You must be logged in to mark attendance.", "danger");
        return;
      }

      // Send request to backend to mark attendance
      const response = await axios.post(
        `${API_BASE_URL}/api/attendance/mark`,
        {
          className:`${classInfo.subject} (${classInfo.time})`,
          status:"present",
        },
        {
          headers:{'auth-token':token},
        }
      );

      if (response.data) {
        showalert("Attendance marked successfully", "success");
        setAttendance((prev) => ({
          ...prev,
          [`${classInfo.subject} (${classInfo.time})`]: true,
        }));
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      showalert("Error marking attendance.", "danger");
    }
  };

  return (
    <div
      className={`container ${mode === 'dark' ? 'text-light' : ''}`}
      style={{
        marginTop:"4rem",
        padding:"2rem",
        backgroundColor:
          mode === 'dark' ? '#222222' : '#ffffff',
        borderRadius:"8px",
        boxShadow:
          mode === 'dark'
            ? '0px 4px 10px rgba(0,0,0,0.8)'
            : '0px 4px 10px rgba(0,0,0,0.2)',
      }}
    >
      <h2 className="text-center">Today's Classes ({today})</h2>
      
      {/* Check if there are classes for today */}
      {timetable[today] && timetable[today].length > 0 ? (
        <ul className="list-group">
          {timetable[today].map((classInfo, index) => (
            <li
              key={index}
              className={`list-group-item ${
                mode === 'dark' ? 'bg-dark text-light' : ''
              }`}
              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                borderColor:
                  mode === 'dark' ? '#444444' : '#dddddd',
              }}
            >
              <div>
                <strong>{classInfo.time}</strong> - {classInfo.subject}
              </div>
              <button
                className="btn btn-outline-success"
                onClick={() => markAttendance(classInfo)}
                disabled={attendance[`${classInfo.subject} (${classInfo.time})`]} // Disable button if already marked
              >
                {attendance[`${classInfo.subject} (${classInfo.time})`] ? 'Marked' : 'Mark Attendance'}
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