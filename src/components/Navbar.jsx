import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useNotifications from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const { notifications, unreadCount, markAsRead } =
    useNotifications(user?.id);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px",
        background: "#111",
        color: "white",
        alignItems: "center",
      }}
    >
      <button onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/profile")}>
        Profile
      </button>
      
      <button onClick={() => navigate("/notifications")}>
  Notifications
</button>
       
       <button onClick={() => navigate("/files")}>
  Files
</button>

      <button onClick={handleLogout}>
        Logout
      </button>

      {/* Notification Bell */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowDropdown(!showDropdown)}>
          🔔 {unreadCount}
        </button>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              background: "#222",
              padding: "10px",
              width: "260px",
              borderRadius: "8px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  background: n.read ? "#333" : "#555",
                }}
              >
                <strong>{n.title}</strong>
                <p>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;