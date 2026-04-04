function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">

      {/* Profile Card */}
      <div className="w-[400px] p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold">
            R
          </div>
          <h1 className="text-2xl font-semibold mt-3">Rishika</h1>
          <p className="text-gray-400 text-sm">Viewer</p>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Email</span>
            <span>rishika@example.com</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Role</span>
            <span className="text-indigo-400">Viewer</span>
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Status</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>

        {/* Button */}
        <button className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;