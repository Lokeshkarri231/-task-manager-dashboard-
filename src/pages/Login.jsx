import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { supabase } from "../lib/supabaseClient";
import { signUpUser } from "../services/auth";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🔐 LOGIN
  const handleLogin = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    navigate("/dashboard");
  }
};
  // 🆕 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await signUpUser({
      name,
      email,
      password,
    });

    if (res) {
      alert("Signup successful 🚀");
      setIsSignup(false); // switch back to login
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Task Manager</h2>
        <p className="login-subtitle">
          {isSignup ? "Create your account" : "Sign in to continue"}
        </p>

        <form onSubmit={isSignup ? handleSignup : handleLogin}>

          {/* Name field only for signup */}
          {isSignup && (
            <input
              className="login-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

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
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p style={{ marginTop: "15px" }}>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            style={{
              marginLeft: "8px",
              background: "none",
              border: "none",
              color: "#4f46e5",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;