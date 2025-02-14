import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ViewAttendance from './Components/ViewAttendance';
import MarkAttendance from './Components/MarkAttendance';
import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './Privateroute';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';

const App = () => {
  // Simple alert function for demonstration
  const showAlert = (msg, type) => alert(`${type}: ${msg}`);
  const mode = "light";
  return (
    <Router>
      <Navbar mode={mode} showalert={showAlert} />
      <div className="container mt-4">
        <Routes>
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <ViewAttendance />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/mark" 
            element={
              <PrivateRoute>
                <MarkAttendance />
              </PrivateRoute>
            } 
          />
          {/* Public routes */}
          <Route path="/login" element={<Login mode={mode} showalert={showAlert} />} />
          <Route path="/signup" element={<Signup mode={mode} showalert={showAlert} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
