import React, { useState, useEffect } from "react";

const Timetable = ({ mode }) => {
  // Sample timetable data based on the provided image
  const timetable = {
    Monday: [
      { time: "9:00 - 9:50", subject: "CO102 (Lab)", location: "AB-127 (G1)" },
      { time: "10:00 - 10:50", subject: "MC106", location: "P6-G1" },
      { time: "11:00 - 11:50", subject: "MC106", location: "P6-G1" },
      { time: "2:00 - 2:50", subject: "MC104", location: "P6-F4" },
      { time: "3:00 - 3:50", subject: "MC104", location: "P6-F4" },
    ],
    Tuesday: [
      { time: "9:00 - 9:50", subject: "AEC/VAC", location: "P1-G2" },
      { time: "11:00 - 11:50", subject: "MC106", location: "P6-G2" },
      { time: "2:00 - 2:50", subject: "CO102", location: "P6-F4" },
    ],
    Wednesday: [
      { time: "10:00 - 10:50", subject: "MC106", location: "P6-G2" },
      { time: "12:00 - 12:50", subject: "MC102", location: "P6-F3" },
    ],
    Thursday: [
      { time: "9:00 - 9:50", subject: "AEC/VAC", location: "P1-G2" },
      { time: "11:00 - 11:50", subject: "MC106 (Lab)", location: "AB-127 (G1)" },
    ],
    Friday: [
      { time: "9:00 - 9:50", subject: "MC106 (Lab)", location: "AB-127 (G1)" },
      { time: "2:00 - 2:50", subject: "CO102", location: "P6-F4" },
    ],
  };

  // Get today's day
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = daysOfWeek[new Date().getDay()];

  // State to track attendance
  const [attendance, setAttendance] = useState({});

  // Load attendance from localStorage on mount
  useEffect(() => {
    const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendance(savedAttendance);
  }, []);

  // Save attendance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  // Mark attendance for a class
  const markAttendance = (time) => {
    setAttendance((prev) => ({
      ...prev,
      [time]: true,
    }));
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
                <strong>{classInfo.time}</strong> - {classInfo.subject} ({classInfo.location})
              </div>
              <button
                className="btn btn-outline-success"
                onClick={() => markAttendance(classInfo.time)}
                disabled={attendance[classInfo.time]} // Disable button if already marked
              >
                {attendance[classInfo.time] ? 'Marked' : 'Mark Attendance'}
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