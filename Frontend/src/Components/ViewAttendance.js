// src/Components/ViewAttendance.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendancePieCharts from './AttendancePieCharts';
import EditAttendanceModal from './EditAttendanceModal';

const ViewAttendance = (props) => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  // State to control modal visibility and hold the selected record
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const { mode, showalert } = props;

  // Fetch attendance records on component mount
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

  // Handler to open the modal for editing
  const handleEditClick = (record) => {
    setSelectedAttendance(record);
    setShowModal(true);
  };

  // Handler to close the modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedAttendance(null);
  };

  // Handler to save updated attendance
  const handleSaveChanges = async (updatedRecord) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4000/api/attendance/edit/${updatedRecord._id}`,
        updatedRecord,
        { headers: { "auth-token": token } }
      );
      // Update the records state with the updated record
      setRecords(records.map(r => r._id === updatedRecord._id ? response.data : r));
    } catch (err) {
      console.error(err);
      showalert("Error updating record", "danger");
    }
  };

  // Handler to delete an attendance record
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/attendance/delete/${id}`, {
        headers: { "auth-token": token }
      });
      // Update local state by removing the deleted record
      setRecords(records.filter(r => r._id !== id));
      showalert("Deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showalert("Error deleting record", "danger");
    }
  };

  return (
    <div>
      <h2>Attendance Records</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <ul className="list-group">
        {records.map(record => (
          <li key={record._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Subject:</strong> {record.className} <br />
              <strong>Date:</strong> {new Date(record.date).toLocaleDateString()} <br />
              <strong>Status:</strong> {record.status}
            </div>
            <div>
              {/* Edit Icon */}
              <i 
                className="fa-regular fa-pen-to-square mx-2"
                style={{ cursor: "pointer" }}
                onClick={() => handleEditClick(record)}>
              </i>
              {/* Delete Icon */}
              <i 
                className="fa-solid fa-trash-can my-1 mx-2"
                style={{ cursor: "pointer", color: "black" }}
                onClick={() => handleDelete(record._id)}>
              </i>
            </div>
          </li>
        ))}
      </ul>
      
      <hr />
      <h3>Attendance Summary (by Subject)</h3>
      <AttendancePieCharts attendanceRecords={records} />

      {/* Edit Modal */}
      {selectedAttendance && (
        <EditAttendanceModal
          show={showModal}
          handleClose={handleModalClose}
          attendanceRecord={selectedAttendance}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default ViewAttendance;
