import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Save preference in localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Navbar */}
      {/* Navbar */}
<nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex justify-between items-center shadow-lg">
  <div className="flex gap-6 items-center">
    <Link className="font-semibold hover:underline" to="/">Dashboard</Link>
    <Link className="font-semibold hover:underline" to="/profile">Profile</Link>
    <Link className="font-semibold hover:underline" to="/admin">Admin</Link>
    <Link className="font-semibold hover:underline" to="/login">Login</Link>
    <Link className="font-semibold hover:underline" to="/signup">Signup</Link>
  </div>

  <div className="flex items-center gap-4">
    {/* Dark Mode Toggle */}
    <button
      onClick={toggleDarkMode}
      className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition font-semibold text-sm"
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>

    {/* User Role Indicator */}
    <span className="px-3 py-1 bg-black/30 rounded text-sm font-medium">
      Role: {user ? user.role : "Viewer"}
    </span>
  </div>
</nav>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </div>
  );
}

export default App;
