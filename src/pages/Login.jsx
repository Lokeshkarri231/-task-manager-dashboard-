import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Task Manager</h2>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleLogin}>

          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;