import React, { useState } from "react";

function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      status: "Pending"
    };

    addTask(newTask);

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Task</h3>

      <input
  className="form-input"
  type="text"
  placeholder="Task title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
      <br /><br />

      <input
  className="form-input"
  type="text"
  placeholder="Task description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

      <br /><br />

     <input
  className="form-input"
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>

      <br /><br />

      <select
  className="form-input"
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <br /><br />

      <button className="add-task-btn">Add Task</button>
    </form>
  );
}

export default TaskForm;
