import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useNotifications from "../hooks/useNotifications";

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  const notifications = useNotifications(user?.id);

  return (
    <div style={{ display: "flex", gap: "20px", padding: "10px" }}>
      <a href="/dashboard">Dashboard</a>
      <a href="/profile">Profile</a>

      <button onClick={() => supabase.auth.signOut()}>
        Logout
      </button>

      <div style={{ position: "relative" }}>
        <button onClick={() => setShowDropdown(!showDropdown)}>
          🔔 {notifications.length}
        </button>

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40px",
              background: "#222",
              padding: "10px",
              width: "250px",
              borderRadius: "8px"
            }}
          >
            {notifications.length === 0 && <p>No notifications</p>}

            {notifications.map((n) => (
              <div key={n.id} style={{ marginBottom: "10px" }}>
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