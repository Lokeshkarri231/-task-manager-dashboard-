import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [file, setFile] = useState(null);

  async function uploadFile(file) {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (error) {
      alert("File upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let fileUrl = null;

    if (file) {
      fileUrl = await uploadFile(file);
    }

    const newTask = {
      title,
      description,
      due_date: dueDate,
      priority,
      status: "Pending",
      file_url: fileUrl,
    };

    addTask(newTask);

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setFile(null);
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

      {/* File Upload */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button className="add-task-btn">Add Task</button>
    </form>
  );
}

export default TaskForm;