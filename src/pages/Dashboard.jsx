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

  const [selectedFile, setSelectedFile] = useState(null);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
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

  // ✅ UPDATED FETCH (STEP 9)
  const fetchTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        task_members(user_id)
      `)
      .or(`user_id.eq.${user.id},task_members.user_id.eq.${user.id}`)
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

  // ✅ SHARE FUNCTION (STEP 9)
  const shareTask = async (taskId, email) => {
    const { data: userData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (!userData) {
      alert("User not found");
      return;
    }

    const { error } = await supabase
      .from("task_members")
      .insert([
        {
          task_id: taskId,
          user_id: userData.id
        }
      ]);

    if (error) {
      alert("Share failed");
    } else {
      alert("Task shared successfully");
    }
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
      <h1 style={{ fontSize: "26px" }}>Dashboard</h1>

      <p style={{ color: "#94a3b8" }}>
        Total Tasks: {tasks.length}
      </p>

      <TaskForm addTask={fetchTasks} />

      {/* Filters */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      {/* TASKS */}
      <div style={{ marginTop: "20px" }}>
        {filteredTasks.map((task) => (
          <div key={task.id} style={{ padding: "15px", background: "#020617", marginBottom: "10px" }}>
            
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <div>
              <span>Due: {task.due_date}</span> | <span>{task.status}</span>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={() => toggleComplete(task.id)}>Toggle</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>

              {/* ✅ SHARE BUTTON */}
              <button
                onClick={() => {
                  const email = prompt("Enter user email:");
                  if (email) shareTask(task.id, email);
                }}
              >
                Share
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

      {/* FILE VIEWER */}
      {selectedFile && (
        <div style={modalStyle}>
          <div style={modalBox}>
            <button onClick={() => setSelectedFile(null)}>X</button>
            <iframe src={selectedFile} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      )}

      <KanbanBoard tasks={tasks} setTasks={setTasks} />

      {/* AI BUTTON */}
      <div onClick={() => setShowAI(true)} style={aiBtn}>
        💬 AI
      </div>

      {/* AI PANEL */}
      {showAI && (
        <div style={aiPanel}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AI Assistant</span>
            <button onClick={() => setShowAI(false)}>X</button>
          </div>

          <AiAssistant />
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
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  width: "80%",
  height: "80%",
  background: "#020617"
};

const aiBtn = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "#3b82f6",
  color: "white",
  padding: "10px",
  borderRadius: "50%",
  cursor: "pointer"
};

const aiPanel = {
  position: "fixed",
  bottom: "80px",
  right: "20px",
  width: "300px",
  height: "400px",
  background: "#020617",
  padding: "10px"
};

export default Dashboard;