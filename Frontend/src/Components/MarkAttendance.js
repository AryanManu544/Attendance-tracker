// src/MarkAttendance.jsx
import React, { useState } from 'react';
import axios from 'axios';

const MarkAttendance = () => {
    const [className, setClassName] = useState("");
    const [status, setStatus] = useState("present");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:4000/api/attendance/mark", 
                { className, status },
                { headers: { "Content-Type": "application/json", "auth-token": token } }
            );
            setMessage("Attendance marked successfully!");
            setClassName("");
            setStatus("present");
        } catch (err) {
            setError("Error marking attendance.");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Class Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Status</label>
                    <select
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Mark Attendance</button>
            </form>
            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default MarkAttendance;
