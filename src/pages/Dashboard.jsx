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

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  // ✅ Analytics
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

  // ✅ Filtering Logic
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
    <div>
      <h2>Task Dashboard</h2>

      {/* ✅ Logout Button */}
      <button onClick={handleLogout}>Logout</button>

      <br /><br />

      <div>
        <h3>Analytics</h3>

        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
        <p>Pending Tasks: {pendingTasks}</p>
        <p>Completion: {completionPercentage}%</p>

        <hr />
      </div>

      <TaskForm addTask={addTask} />

      <div>
        <h3>Filters</h3>

        <input
          type="text"
          placeholder="Search task"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <br /><br />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <br /><br />

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

      <h3>Task List</h3>

      {filteredTasks.length === 0 && <p>No tasks found</p>}

      {filteredTasks.map((task) => (
        <div key={task.id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Due Date: {task.dueDate}</p>
          <p>Priority: {task.priority}</p>

          <button onClick={() => toggleComplete(task.id)}>
            Mark Complete
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;