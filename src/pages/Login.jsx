import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { supabase } from "../lib/supabaseClient";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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