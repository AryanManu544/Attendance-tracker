// src/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = ({ mode, showalert }) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password } = credentials;
      const response = await fetch("http://localhost:4000/api/auth/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();
      if (json.authtoken) {
        localStorage.setItem("token", json.authtoken);
        showalert("Account created successfully", "success");
        navigate("/");
      } else {
        showalert("Invalid credentials", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-container" style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h2 className="text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={credentials.name}
            onChange={onChange}
            id="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={credentials.email}
            onChange={onChange}
            id="email"
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={credentials.password}
            onChange={onChange}
            id="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="cpassword"
            value={credentials.cpassword}
            onChange={onChange}
            id="cpassword"
          />
        </div>
        <button type="submit" className="btn btn-outline-primary w-100">Sign Up</button>
      </form>
      <div className="login-link text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
