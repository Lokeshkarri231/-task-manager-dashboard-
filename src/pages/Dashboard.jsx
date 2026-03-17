import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import TaskForm from "../components/TaskForm"; 

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);

  // ✅ SAFE session check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // ✅ SAFE localStorage load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tasks");
      if (saved && saved !== "undefined") {
        setTasks(JSON.parse(saved));
      }
    } catch {
      localStorage.removeItem("tasks");
    }
  }, []);

  // ✅ SAFE localStorage save
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ ADD TASK FUNCTION
  const addTask = (task) => {
    if (!task) return;
    setTasks([...tasks, task]);
  };

  // ✅ PREVENT CRASH
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <div style={{ color: "white", padding: "30px" }}>
      <h1>Dashboard ✅</h1>
      <p>Total Tasks: {tasks.length}</p>

      {/* ✅ Task Form */}
      <div style={{ marginTop: "20px" }}>
        <TaskForm addTask={addTask} />
      </div>
    </div>
  );
}

export default Dashboard;