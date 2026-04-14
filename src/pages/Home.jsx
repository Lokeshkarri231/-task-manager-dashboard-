import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ NEW

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#020617", color: "white", minHeight: "100vh" }}>
      
      {/* HERO */}
      <motion.div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          background: "linear-gradient(to bottom, #020617, #0f172a)"
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px", fontWeight: "bold" }}>
          AI-Powered Task Manager 🚀
        </h1>

        <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "auto" }}>
          Manage your tasks smarter with AI, collaborate with your team,
          track deadlines, and stay productive like never before.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/login")}
            style={primaryBtn}
          >
            Get Started
          </button>

          <button style={secondaryBtn}>
            Learn More
          </button>
        </div>
      </motion.div>

      {/* FEATURES */}
      <motion.div
        style={{ padding: "60px 20px", textAlign: "center" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 style={{ marginBottom: "40px" }}>Features</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          
          {[
            { title: "AI Assistant 🤖", desc: "Get smart task suggestions instantly" },
            { title: "Team Collaboration 👥", desc: "Share tasks and work together" },
            { title: "File Management 📄", desc: "Upload and view files inside app" }
          ].map((f, i) => (
            <motion.div
              key={i}
              style={featureCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h3>{f.title}</h3>
              <p style={{ color: "#94a3b8" }}>{f.desc}</p>
            </motion.div>
          ))}

        </div>
      </motion.div>

      {/* PRICING */}
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Pricing</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
          
          <div style={pricingCard}>
            <h3>Free</h3>
            <p style={{ fontSize: "24px" }}>₹0</p>
            <p>5 Tasks Limit</p>
          </div>

          <div style={{ ...pricingCard, border: "2px solid #3b82f6" }}>
            <h3>Pro</h3>
            <p style={{ fontSize: "24px" }}>₹199/mo</p>
            <p>Unlimited Tasks</p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Start managing your work today 🚀</h2>

        <button
          onClick={() => navigate("/login")}
          style={{ ...primaryBtn, marginTop: "20px" }}
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
}

const primaryBtn = {
  padding: "12px 20px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  marginRight: "10px"
};

const secondaryBtn = {
  padding: "12px 20px",
  background: "transparent",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};

const featureCard = {
  background: "#0f172a",
  padding: "20px",
  borderRadius: "12px",
  width: "250px"
};

const pricingCard = {
  background: "#0f172a",
  padding: "30px",
  borderRadius: "12px",
  width: "200px"
};

export default Home;