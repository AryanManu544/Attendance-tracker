import React, { useState, useEffect } from "react";
import axios from "axios";
import "../custom.css";

const MarkAttendance = ({ mode, showalert }) => {
  const [formData, setFormData] = useState({ className: "", status: "present" });
  const [error, setError] = useState("");

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/api/attendance/mark`, formData, {
        headers: { "auth-token": token },
      });
      if (response.data) {
        showalert("Attendance marked successfully", "success");
        setFormData({ className: "", status: "present" });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError("Error marking attendance");
      showalert("Error marking attendance", "danger");
    }
  };

  return (
    <div
      className={`container ${mode === 'dark' ? 'bg-dark text-light' : ''}`}
      style={{ maxWidth: "500px", margin: "4rem auto", padding: "1rem", borderRadius: "8px" }}
    >
      <h2 className="text-center">Mark Attendance</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="className" className="form-label">Class Name</label>
          <input
            type="text"
            className={`form-control ${mode === 'dark' ? 'dark-placeholder' : 'light-placeholder'}`}
            name="className"
            value={formData.className}
            onChange={onChange}
            id="className"
            placeholder="Enter class name"
            required
            style={
              mode === 'dark'
                ? { backgroundColor: "#222222", color: "white", borderColor: "#444" }
                : {}
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={onChange}
            id="status"
            required
            style={
              mode === 'dark'
                ? { backgroundColor: "#222222", color: "white", borderColor: "#444" }
                : {}
            }
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline-primary w-100">Mark Attendance</button>
      </form>
    </div>
  );
};

export default MarkAttendance;