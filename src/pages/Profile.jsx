function Profile({ user }) {
  const currentUser = user || {
    name: "Rishika",
    email: "rishika@example.com",
    role: "Viewer",
    status: "Active",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      {/* Profile Card */}
      <div className="w-[400px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl hover:scale-105 transition duration-300">
        
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg">
            {currentUser.name.charAt(0)}
          </div>

          <h1 className="text-2xl font-semibold mt-3">{currentUser.name}</h1>
          <p className="text-gray-400 text-sm">{currentUser.role}</p>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email</span>
            <span>{currentUser.email}</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Role</span>
            <span className={`font-semibold ${currentUser.role === "Admin" ? "text-purple-400" : "text-indigo-400"}`}>
              {currentUser.role}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400">{currentUser.status}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition">
            Edit Profile
          </button>
          {currentUser.role === "Admin" && (
            <button className="w-full py-3 rounded-lg bg-red-500/80 hover:bg-red-500 transition">
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
