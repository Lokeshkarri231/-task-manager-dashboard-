import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  async function getNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
  }

  async function markAsRead(id) {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    getNotifications();
  }

  async function deleteNotification(id) {
    await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    getNotifications();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 && <p>No notifications</p>}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: n.read ? "#222" : "#444",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>

          <button onClick={() => markAsRead(n.id)}>
            Mark Read
          </button>

          <button onClick={() => deleteNotification(n.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;