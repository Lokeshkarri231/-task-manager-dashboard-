import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Files from "./pages/Files";
import Documents from "./pages/Documents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/files" element={<Files />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </Router>
  );
}

export default App;