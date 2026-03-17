import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import toast from "react-hot-toast";
import AiAssistant from "../components/AiAssistant";
import KanbanBoard from "../components/KanbanBoard";
import { supabase } from "../lib/supabaseClient"; 

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      return []; 
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  // ✅ FIXED: Supabase session check instead of localStorage
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  // ✅ Save tasks safely
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  // 🔔 Overdue notification (safe)
  useEffect(() => {
    tasks.forEach((task) => {
      if (task?.status === "Pending" && task?.dueDate) {
        const today = new Date();
        const due = new Date(task.dueDate);

        if (due < today) {
          toast.error(`⚠ Task "${task.title}" is overdue`);
        }
      }
    });
  }, [tasks]);

  const addTask = (task) => {
    if (!task) return;
    setTasks([...tasks, task]);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === "Pending" ? "Completed" : "Pending",
          }
        : task
    );

    setTasks(updatedTasks);
  };

  // ✅ FIXED logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

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

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid">

        {/* ANALYTICS */}
        <div className="analytics">

          <div className="card glass-card">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>

          <div className="card glass-card">
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </div>

          <div className="card glass-card">
            <h3>Pending</h3>
            <p>{pendingTasks}</p>
          </div>

          <div className="card glass-card">
            <h3>Completion</h3>
            <p>{completionPercentage}%</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

          </div>

        </div>

        {/* ADD TASK */}
        <div className="task-form-section glass-card">
          <TaskForm addTask={addTask} />
        </div>

        {/* FILTERS */}
        <div className="filters glass-card">

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

        {/* TASK LIST */}
        <div className="task-list">

          {filteredTasks.length === 0 && (
            <div className="empty-state glass-card">
              🚀 No tasks yet. Add your first task!
            </div>
          )}

          {filteredTasks.map((task) => (

            <div key={task.id} className="task-card glass-card">

              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <p>
                Status:
                <span className={`status ${task.status.toLowerCase()}`}>
                  {task.status}
                </span>
              </p>

              <p>
                Priority:
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </p>

              <p>Due Date: {task.dueDate}</p>

              <div className="task-buttons">

                <button
                  className="complete-btn"
                  onClick={() => toggleComplete(task.id)}
                >
                  Complete
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* 🚀 KANBAN BOARD */}
      <div style={{ marginTop: "40px" }}>
        <KanbanBoard tasks={tasks} setTasks={setTasks} />
      </div>

      {/* 🤖 AI ASSISTANT */}
      <AiAssistant />

    </div>
  );
}

export default Dashboard;