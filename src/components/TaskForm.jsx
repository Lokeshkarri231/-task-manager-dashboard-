import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !dueDate) {
      alert("Title and due date are required");
      return;
    }

    setLoading(true);

    try {
      // ✅ GET USER
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      // 🔥 STEP 10 — CHECK USER PLAN
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      // 🔥 COUNT USER TASKS
      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 🚫 LIMIT FREE USERS
      if (profile?.plan === "free" && count >= 5) {
        alert("Free plan limit reached (5 tasks). Upgrade to Pro.");
        setLoading(false);
        return;
      }

      let fileUrl = null;

      if (file) {
        fileUrl = await uploadFile(file);
        if (!fileUrl) {
          setLoading(false);
          return;
        }
      }

      // ✅ INSERT TASK
      const { error } = await supabase.from("tasks").insert([
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
      ]);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (addTask) addTask();

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
      setFile(null);

      alert("Task added successfully");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#020617",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid #1e293b",
        maxWidth: "500px"
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Add New Task</h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={inputStyle}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#94a3b8" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            borderRadius: "8px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #1e293b",
  background: "#0f172a",
  color: "white"
};

export default TaskForm;