import { Link } from "react-router-dom";
function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">

      {/* Card */}
      <div className="w-[380px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h1>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Button */}
        <button className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:scale-105 transition">
          Login
        </button>

        {/* Extra */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span className="text-indigo-400 cursor-pointer hover:underline">
            <Link to="/signup">Sign up</Link>
          </span>
        </p>

        
      </div>
    </div>
  );
}

export default Login;