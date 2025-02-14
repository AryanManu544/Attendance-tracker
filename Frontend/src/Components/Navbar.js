import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ mode, showalert }) => {
  const navigate = useNavigate();

  const handleSignout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    showalert("Signed out successfully", "success");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Attendance Tracker</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Left side menu items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">View Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mark">Mark Attendance</Link>
            </li>
          </ul>
          {/* Right side buttons */}
          <div className="d-flex ms-auto">
            {!localStorage.getItem("token") ? (
              <>
                <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
                <Link className="btn btn-outline-primary" to="/signup">Signup</Link>
              </>
            ) : (
              <button onClick={handleSignout} className="btn btn-outline-danger">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
