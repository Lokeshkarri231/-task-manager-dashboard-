import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import AiAssistant from "../components/AiAssistant";
import Layout from "../components/Layout";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ✅ STEP 6
  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ STEP 7 (AI PANEL)
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error.message);
        navigate("/");
        return;
      }

      if (!data.session) {
        navigate("/");
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("Failed to load tasks");
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const deleteTask = async (id) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus =
      task.status === "Pending" ? "Completed" : "Pending";

    await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    fetchTasks();
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "All" ? true : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter
    );

  if (loading) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
        Dashboard
      </h1>

      <p style={{ color: "#94a3b8" }}>
        Total Tasks: {tasks.length}
      </p>

      <div style={{ marginTop: "20px" }}>
        <TaskForm addTask={fetchTasks} />
      </div>

      {/* Filters */}
      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            background: "#020617",
            color: "white",
            border: "1px solid #1e293b"
          }}
        />

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <select onChange={(e) => setPriorityFilter(e.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* TASK CARDS */}
      <div style={{ marginTop: "20px" }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: "#020617",
              marginBottom: "12px",
              border: "1px solid #1e293b"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{task.title}</h3>

              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  background:
                    task.priority === "High"
                      ? "#dc2626"
                      : task.priority === "Medium"
                      ? "#f59e0b"
                      : "#22c55e",
                  color: "white"
                }}
              >
                {task.priority}
              </span>
            </div>

            <p style={{ color: "#94a3b8" }}>{task.description}</p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Due: {task.due_date}</span>
              <span>{task.status}</span>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => toggleComplete(task.id)}>
                Toggle
              </button>

              <button onClick={() => deleteTask(task.id)}>
                Delete
              </button>

              {task.file_url && (
                <button onClick={() => setSelectedFile(task.file_url)}>
                  View File
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FILE MODAL */}
      {selectedFile && (
        <div style={modalStyle}>
          <div style={modalBox}>
            <button onClick={() => setSelectedFile(null)}>X</button>
            <iframe src={selectedFile} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      )}

      <KanbanBoard tasks={tasks} setTasks={setTasks} />

      {/* 🔥 AI FLOAT BUTTON */}
      <div
        onClick={() => setShowAI(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#3b82f6",
          color: "white",
          padding: "12px 16px",
          borderRadius: "999px",
          cursor: "pointer"
        }}
      >
        💬 AI
      </div>

      {/* 🔥 AI PANEL */}
      {showAI && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "#020617",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
            <span>AI Assistant</span>
            <button onClick={() => setShowAI(false)}>X</button>
          </div>

          <div style={{ flex: 1, overflow: "auto" }}>
            <AiAssistant />
          </div>
        </div>
      )}
    </Layout>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalBox = {
  width: "80%",
  height: "80%",
  background: "#020617",
  padding: "10px"
};

export default Dashboard;