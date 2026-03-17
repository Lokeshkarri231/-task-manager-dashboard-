import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import AiAssistant from "../components/AiAssistant";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // SESSION CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
      } else {
        setUser(data.session.user);
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // TEMP localStorage fallback
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

  // FETCH FROM SUPABASE
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error fetching tasks:", error.message);
      } else {
        setTasks(data);
      }
    };

    fetchTasks();
  }, [user]);

  // TEMP localStorage save
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // CREATE
  const addTask = async (task) => {
    if (!task || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,
          title: task.title,
          description: task.description,
          status: task.status || "Pending",
          priority: task.priority,
          due_date: task.dueDate,
        },
      ])
      .select();

    if (error) {
      console.log("Error adding task:", error.message);
    } else {
      setTasks([data[0], ...tasks]);
    }
  };

  // ✅ DELETE (NOW FROM SUPABASE)
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Delete error:", error.message);
    } else {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // ✅ UPDATE (TOGGLE STATUS IN DB)
  const toggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus =
      task.status === "Pending" ? "Completed" : "Pending";

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.log("Update error:", error.message);
    } else {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      setTasks(updated);
    }
  };

  // FILTER LOGIC
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

      {/* Filters */}
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

      {/* Kanban */}
      <div style={{ marginTop: "40px" }}>
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
      </div>

      {/* AI */}
      <div style={{ marginTop: "40px" }}>
        <AiAssistant />
      </div>
    </div>
  );
}

export default Dashboard;