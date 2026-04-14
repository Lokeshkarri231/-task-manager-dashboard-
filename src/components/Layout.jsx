import React from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Layout({ children }) {
  const location = useLocation();

  // ✅ STEP 8 STATES
  const [notifications, setNotifications] = React.useState([]);
  const [showNotif, setShowNotif] = React.useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Documents", path: "/documents" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" }
  ];

  // ✅ FETCH NOTIFICATIONS
  React.useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0b1120" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#020617",
          color: "#e2e8f0",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #1e293b"
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "30px" }}>
          TaskFlow
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  padding: "10px 15px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#94a3b8",
                  background: isActive ? "#1e293b" : "transparent",
                  transition: "0.2s",
                  fontSize: "14px"
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* 🔥 TOPBAR */}
        <div
          style={{
            height: "60px",
            background: "#020617",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            position: "relative"
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              color: "white",
              width: "250px"
            }}
          />

          {/* Right Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            
            {/* 🔔 NOTIFICATION ICON */}
            <div
              onClick={() => setShowNotif(!showNotif)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              🔔

              {/* 🔴 UNREAD COUNT */}
              {notifications.filter((n) => !n.read).length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "red",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "999px"
                  }}
                >
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>

            {/* User Avatar */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px"
              }}
            >
              U
            </div>
          </div>

          {/* 🔥 NOTIFICATION PANEL */}
          {showNotif && (
            <div
              style={{
                position: "absolute",
                top: "60px",
                right: "20px",
                width: "300px",
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                padding: "10px",
                zIndex: 1000
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>Notifications</h4>

              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #1e293b",
                      fontSize: "13px"
                    }}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto",
            color: "white"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;