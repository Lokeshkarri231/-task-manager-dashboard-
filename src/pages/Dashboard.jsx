import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Dashboard() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState(() => {
  try {
    const saved = localStorage.getItem("tasks");

    if (!saved || saved === "undefined") return [];

    return JSON.parse(saved);
  } catch (error) {
    console.log("Corrupted tasks, resetting...");
    localStorage.removeItem("tasks");
    return [];
  }
});

  // ✅ session check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
      }
    };
  useEffect(() => {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (err) {
    console.log("Error saving tasks");
  }
}, [tasks]);
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
  <p>Total Tasks: {tasks.length}</p>
</div>

    </div>
  );
}

export default Dashboard;