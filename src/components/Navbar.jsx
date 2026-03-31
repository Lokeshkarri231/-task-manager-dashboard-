import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <div
      style={{
        background: "#111",
        color: "white",
        padding: "15px",
        display: "flex",
        gap: "20px",
      }}
    >
      <button onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/profile")}>
        Profile
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;