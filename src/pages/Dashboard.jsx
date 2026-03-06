import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
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
      task.title.toLowerCase().includes(search.toLowerCase())
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
      <div className="navbar">

        <div className="logo">
          Task Manager
        </div>

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

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* ANALYTICS */}
      <div className="analytics">

        <div className="card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>

        <div className="card">
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
      <div className="task-form-section">
        <TaskForm addTask={addTask} />
      </div>

      {/* FILTERS */}
      <div className="filters">

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
          <div className="empty-state">
            🚀 No tasks yet. Add your first task!
          </div>
        )}

        {filteredTasks.map((task) => (

          <div key={task.id} className="task-card">

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
  );
}

export default Dashboard;
