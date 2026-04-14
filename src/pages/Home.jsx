import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#020617", color: "white", minHeight: "100vh", padding: "40px" }}>
      
      {/* HERO */}
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
          Manage Tasks Smarter with AI 🚀
        </h1>

        <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "auto" }}>
          A powerful SaaS task manager with AI assistant, file uploads,
          notifications, and team collaboration.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Get Started
        </button>
      </div>

      {/* FEATURES */}
      <div style={{ marginTop: "80px", display: "flex", justifyContent: "center", gap: "20px" }}>
        
        {[
          "AI Task Assistant 🤖",
          "Team Collaboration 👥",
          "File Upload & Viewer 📄"
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              background: "#0f172a",
              borderRadius: "10px",
              width: "200px",
              textAlign: "center"
            }}
          >
            {feature}
          </div>
        ))}

      </div>

      {/* PRICING */}
      <div style={{ marginTop: "80px", textAlign: "center" }}>
        <h2>Pricing</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          
          {/* FREE */}
          <div style={cardStyle}>
            <h3>Free</h3>
            <p>₹0</p>
            <p>Up to 5 tasks</p>
          </div>

          {/* PRO */}
          <div style={cardStyle}>
            <h3>Pro</h3>
            <p>₹199/month</p>
            <p>Unlimited tasks</p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div style={{ marginTop: "80px", textAlign: "center" }}>
        <h2>Start managing your tasks today</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "#22c55e",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#0f172a",
  padding: "20px",
  borderRadius: "10px",
  width: "180px"
};

export default Home;