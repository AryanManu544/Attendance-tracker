import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ViewAttendance from "./Components/ViewAttendance";
import MarkAttendance from "./Components/MarkAttendance";
import Login from "./Login";
import Signup from "./Signup";
import PrivateRoute from "./Privateroute";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  const [mode, setMode] = useState("light");
  const showalert = (msg, type) => alert(`${type}: ${msg}`);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Whenever mode changes, update <body> classes so the entire page is dark or light
  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.add("bg-dark", "text-light");
    } else {
      document.body.classList.remove("bg-dark", "text-light");
    }
  }, [mode]);

  return (
    <Router>
      <Navbar mode={mode} showalert={showalert} toggleMode={toggleMode} />
      <div className="container mt-4">
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ViewAttendance mode={mode} showalert={showalert} />
              </PrivateRoute>
            }
          />
          <Route
            path="/mark"
            element={
              <PrivateRoute>
                <MarkAttendance mode={mode} showalert={showalert} />
              </PrivateRoute>
            }
          />
          {/* Public routes */}
          <Route path="/login" element={<Login mode={mode} showalert={showalert} />} />
          <Route path="/signup" element={<Signup mode={mode} showalert={showalert} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;