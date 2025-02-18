import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ViewAttendance from "./Components/ViewAttendance";
import MarkAttendance from "./Components/MarkAttendance";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import PrivateRoute from "./Privateroute";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Analytics } from "@vercel/analytics/react";
import Timetable from './Components/Timetable';


const App = () => {
  const [mode, setMode] = useState("light");
  const [alert, setAlert] = useState(null);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // If you want to display Bootstrap alerts, define showAlert like so:
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Whenever mode changes, set the body background
  useEffect(() => {
    if (mode === "dark") {
      document.body.style.backgroundColor = "#222222";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }, [mode]);

  return (
    <Router>
      <Navbar mode={mode} showalert={showAlert} toggleMode={toggleMode} />
      <div className="container mt-4">
        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.msg}
            <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ViewAttendance mode={mode} showalert={showAlert} />
              </PrivateRoute>
            }
          />
          <Route
            path="/mark"
            element={
              <PrivateRoute>
                <MarkAttendance mode={mode} showalert={showAlert} />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login mode={mode} showalert={showAlert} />} />
          <Route path="/signup" element={<Signup mode={mode} showalert={showAlert} />} />
          <Route path="/timetable" element={<Timetable mode={mode} />} />
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
};
export default App;