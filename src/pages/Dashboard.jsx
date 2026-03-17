import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);

  // ✅ NEW: Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

  // ✅ ADD TASK
  const addTask = (task) => {
    if (!task) return;
    setTasks([...tasks, task]);
  };

  // ✅ DELETE TASK
  const deleteTask = (id) => {
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);
  };

  // ✅ TOGGLE STATUS
  const toggleComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === "Pending" ? "Completed" : "Pending",
          }
        : task
    );

    setTasks(updated);
  };

  // ✅ FILTER LOGIC
  const filteredTasks = tasks
    .filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "All" ? true : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "All" ? true : task.priority === priorityFilter
    );

  // ✅ PREVENT CRASH
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <div style={{ color: "white", padding: "30px" }}>
      <h1>Dashboard ✅</h1>
      <p>Total Tasks: {tasks.length}</p>

      {/* Task Form */}
      <div style={{ marginTop: "20px" }}>
        <TaskForm addTask={addTask} />
      </div>

      {/* ✅ Filters */}
      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task List */}
      <div style={{ marginTop: "30px" }}>
        {filteredTasks.length === 0 && <p>No tasks found 🚀</p>}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #444",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {task.dueDate}</p>

            <button onClick={() => toggleComplete(task.id)}>
              Toggle
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;