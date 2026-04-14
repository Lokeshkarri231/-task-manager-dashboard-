import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import TaskForm from "../components/TaskForm";
import KanbanBoard from "../components/KanbanBoard";
import AiAssistant from "../components/AiAssistant";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ✅ Check logged-in user (FIXED ERROR HANDLING)
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

  // ✅ Fetch tasks from DB (FIXED ERROR HANDLING)
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

  // ✅ Load tasks when user is available
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // ✅ Delete task (FIXED ERROR HANDLING)
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      alert("Failed to delete task");
      return;
    }

    fetchTasks();
  };

  // ✅ Toggle task status (FIXED ERROR HANDLING)
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
      console.error("Update error:", error.message);
      alert("Failed to update task");
      return;
    }

    fetchTasks();
  };

  // ✅ Filtering logic
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
    <>
      <Navbar />

      <div style={{ color: "white", padding: "30px" }}>
        <h1>Dashboard</h1>
        <p>Total Tasks: {tasks.length}</p>

        {/* ✅ Pass fetchTasks */}
        <TaskForm addTask={fetchTasks} />

        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

        <div style={{ marginTop: "20px" }}>
          {filteredTasks.map((task) => (
            <div key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {task.due_date}</p>

              <button onClick={() => toggleComplete(task.id)}>
                Toggle
              </button>
              <button onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <KanbanBoard tasks={tasks} setTasks={setTasks} />
        <AiAssistant />
      </div>
    </>
  );
}

export default Dashboard;