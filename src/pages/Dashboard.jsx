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
      console.error("Fetch error:", error.message);
      alert("Failed to load tasks");
      return;
    }

    setTasks(data);
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const deleteTask = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      alert("Delete failed");
      return;
    }

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

      {/* 🔥 MODERN TASK CARDS (STEP 3) */}
      <div style={{ marginTop: "20px" }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: "#020617",
              marginBottom: "12px",
              border: "1px solid #1e293b",
              transition: "0.2s"
            }}
          >
            {/* Top Row */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px" }}>{task.title}</h3>

              {/* Priority Badge */}
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

            {/* Description */}
            <p style={{ color: "#94a3b8", marginTop: "6px" }}>
              {task.description}
            </p>

            {/* Bottom Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Due: {task.due_date}
              </span>

              <span
                style={{
                  fontSize: "12px",
                  color:
                    task.status === "Completed"
                      ? "#22c55e"
                      : "#f59e0b"
                }}
              >
                ● {task.status}
              </span>
            </div>

            {/* Actions */}
            <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleComplete(task.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  background: "#1e293b",
                  color: "white",
                  border: "none"
                }}
              >
                Toggle
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  background: "#7f1d1d",
                  color: "white",
                  border: "none"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <KanbanBoard tasks={tasks} setTasks={setTasks} />
      <AiAssistant />
    </Layout>
  );
}

export default Dashboard;