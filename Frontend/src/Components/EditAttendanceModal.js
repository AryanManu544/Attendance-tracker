// src/Components/EditAttendanceModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditAttendanceModal = ({ show, handleClose, attendanceRecord, onSave }) => {
  // Local state for the editable fields
  const [className, setClassName] = useState('');
  const [status, setStatus] = useState('');

  // Update local state whenever attendanceRecord changes
  useEffect(() => {
    if (attendanceRecord) {
      setClassName(attendanceRecord.className);
      setStatus(attendanceRecord.status);
    }
  }, [attendanceRecord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedRecord = { ...attendanceRecord, className, status };
    onSave(updatedRecord); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formClassName" className="mb-3">
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              required
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditAttendanceModal;
