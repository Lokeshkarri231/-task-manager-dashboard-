import React, { useState } from "react";

function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!message) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an AI productivity assistant helping users manage tasks and improve efficiency.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("OpenAI Error:", data);
        setResponse(
          data?.error?.message || "AI request failed. Check API key or billing."
        );
        setLoading(false);
        return;
      }

      setResponse(data.choices?.[0]?.message?.content || "No response from AI.");
    } catch (error) {
      console.error("Network Error:", error);
      setResponse("Network error. Check your internet connection.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
        }}
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "30px",
            width: "320px",
            background: "#121212",
            padding: "20px",
            borderRadius: "12px",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <h3>AI Assistant</h3>

          <input
            type="text"
            placeholder="Ask something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "none",
            }}
          />

          <button
            onClick={askAI}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: "#6366f1",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          {response && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "14px",
                background: "#1e1e1e",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              {response}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AiAssistant;