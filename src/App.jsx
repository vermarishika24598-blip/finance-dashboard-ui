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
     <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 flex justify-between items-center shadow-lg rounded-b-lg">
  {/* Left Links */}
  <div className="flex gap-6 items-center">
    <Link className="font-semibold hover:underline transition" to="/">Dashboard</Link>
    <Link className="font-semibold hover:underline transition" to="/profile">Profile</Link>
    <Link className="font-semibold hover:underline transition" to="/admin">Admin</Link>
    <Link className="font-semibold hover:underline transition" to="/login">Login</Link>
    <Link className="font-semibold hover:underline transition" to="/signup">Signup</Link>
  </div>

  {/* Right Controls */}

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
