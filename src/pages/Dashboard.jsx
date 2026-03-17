import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Dashboard() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  // ✅ session check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>

      {/* NAVBAR */}
      <div className="navbar glass-card">
        <div className="logo">Task Manager</div>

        <div className="nav-links">
          <span>Dashboard</span>
          <span>Tasks</span>
        </div>

        <div className="nav-actions">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* SAFE CONTENT */}
      <div style={{ padding: "30px", color: "white" }}>
        <h1>Dashboard Loaded ✅</h1>
        <p>We will now restore features step-by-step</p>
      </div>

    </div>
  );
}

export default Dashboard;