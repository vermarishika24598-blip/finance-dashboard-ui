function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard ⚡</h1>

        <button className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600">
          + Add New
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
          <p className="text-gray-400 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold mt-2">1,240</h2>
        </div>

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
          <p className="text-gray-400 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold mt-2">3,540</h2>
        </div>

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold mt-2 text-green-400">₹85,000</h2>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 text-left">User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-gray-800">
              <td className="py-2">Rishika</td>
              <td className="text-green-400">Added Transaction</td>
              <td>2026-04-05</td>
            </tr>

            <tr className="border-b border-gray-800">
              <td className="py-2">Admin</td>
              <td className="text-yellow-400">Updated Data</td>
              <td>2026-04-04</td>
            </tr>

            <tr>
              <td className="py-2">User123</td>
              <td className="text-red-400">Deleted Entry</td>
              <td>2026-04-03</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Section */}
      <div className="bg-indigo-600/20 border border-indigo-500 rounded-xl p-6">
        <p className="text-gray-300">
          Here admin can manage users, transactions, and system data efficiently.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;