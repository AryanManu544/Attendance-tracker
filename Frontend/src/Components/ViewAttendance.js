// src/Components/ViewAttendance.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendancePieCharts from './AttendancePieCharts';

const ViewAttendance = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/attendance/view", {
          headers: { "auth-token": token }
        });
        setRecords(response.data);
      } catch (err) {
        setError("Error fetching attendance records.");
        console.error(err);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div>
      <h2>Attendance Records</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Optional: List raw attendance records */}
      <ul className="list-group">
        {records.map(record => (
          <li key={record._id} className="list-group-item">
            Subject: {record.className} - Date: {new Date(record.date).toLocaleDateString()} - Status: {record.status}
          </li>
        ))}
      </ul>
      
      <hr />
      <h3>Attendance Summary (by Subject)</h3>
      <AttendancePieCharts attendanceRecords={records} />
    </div>
  );
};

export default ViewAttendance;
