import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ mode, showalert }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hello, React!");
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("REACT_APP_API_BASE_URL from env:", process.env.REACT_APP_API_BASE_URL);
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://presenze-plum.netlify.app/.netlify/functions/server";
      
    console.log("Using API Base URL:", API_BASE_URL); 
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
  
      const json = await response.json();
      if (json.authtoken) {
        localStorage.setItem("token", json.authtoken);
        showalert("Logged in successfully", "success");
        navigate("/");
      } else {
        showalert("Invalid credentials", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showalert("An error occurred", "danger");
    }
  };

  return (
    <div className={`container ${mode === 'dark' ? 'text-light' : ''}`}
    style={{
      backgroundColor: mode === 'dark' ? '#222222' : '#ffffff',
      maxWidth: "400px",
      margin: "4rem auto",
      padding: "1rem",
      borderRadius: "8px"
    }}>
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" name="email" value={credentials.email} onChange={onChange} id="email" 
          style={
              mode === 'dark'
                ? { backgroundColor: "#222222", color: "white", borderColor: "#444" }
                : {}}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{ color: mode === 'dark' ? 'white' : 'black' }}>Password</label>
          <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="password"
          style={
            mode === 'dark'
              ? { backgroundColor: "#222222", color: "white", borderColor: "#444" }
              : {}}
          />
        </div>
        <button type="submit" className="btn btn-outline-primary w-100">Sign In</button>
      </form>
      <div className="text-center mt-3">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;