import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ mode, showalert }) => {
    const navigate = useNavigate();
  
    const handleSignout = () => {
      // Remove the token from localStorage
      localStorage.removeItem('token');
      showalert("Signed out successfully", "success");
      // Redirect to the login page
      navigate('/login');
    };
  
    return (
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
            {/* Signout button appears only if a token exists */}
            {localStorage.getItem('token') && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleSignout}>Signout</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  };

export default Navbar