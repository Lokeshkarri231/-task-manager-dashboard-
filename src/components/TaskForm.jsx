import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Upload file to Supabase Storage
  async function uploadFile(file) {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ PROBLEM 5 FIX — IMPROVED VALIDATION
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !dueDate) {
      alert("Title and due date are required");
      return;
    }

    if (cleanTitle.length > 100) {
      alert("Title too long (max 100 characters)");
      return;
    }

    if (cleanDescription.length > 500) {
      alert("Description too long (max 500 characters)");
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      alert("File too large (max 2MB)");
      return;
    }

    setLoading(true);

    try {
      // ✅ Get logged-in user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      let fileUrl = null;

      // ✅ Upload file safely
      if (file) {
        fileUrl = await uploadFile(file);

        if (!fileUrl) {
          console.warn("File upload failed — stopping task creation");
          setLoading(false);
          return;
        }
      }

      // ✅ Insert into database (USE CLEAN VALUES)
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: cleanTitle,
            description: cleanDescription,
            due_date: dueDate,
            priority,
            status: "Pending",
            file_url: fileUrl,
            user_id: user.id,
            overdue_email_sent: false
          }
        ])
        .select();

      if (error) {
        console.error("Insert error:", error);
        alert(error.message);
        setLoading(false);
        return;
      }

      console.log("Task added:", data);

      // ✅ Refresh tasks
      if (addTask && data && data.length > 0) {
        addTask();
      }

      // ✅ Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setFile(null);

      alert("Task added successfully");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong");
    }

    setLoading(false);
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
        required
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
        required
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

      <button className="add-task-btn" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;