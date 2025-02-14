import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ViewAttendance from './Components/ViewAttendance';
import MarkAttendance from './Components/MarkAttendance';
import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './Privateroute';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  // Simple alert function for demonstration
  const showAlert = (msg, type) => alert(`${type}: ${msg}`);
  const mode = "light";

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Attendance Tracker</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">View Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mark">Mark Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Signup</Link>
            </li>
          </ul>
        </div>
      </nav>
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
