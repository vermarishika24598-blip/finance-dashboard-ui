import React from "react";
import { useFinance } from "../context/FinanceContext";

function AdminDashboard() {
  const { transactions } = useFinance();

  // 💰 calculations
  const totalUsers = new Set(transactions.map((t) => t.user || "User")).size;

  const totalTransactions = transactions.length;

  const totalRevenue = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => {
      return sum + parseInt(t.amount.replace("₹", ""));
    }, 0);

  // 🧾 recent activity (latest 5)
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard ⚡</h1>

        <button className="bg-indigo-500 px-4 py-2 rounded-lg hover:bg-indigo-600">
          + Add New
        </button>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold mt-2">{totalUsers}</h2>
        </div>

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold mt-2">{totalTransactions}</h2>
        </div>

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold mt-2 text-green-400">
            ₹{totalRevenue}
          </h2>
        </div>

      </div>

      {/* 📋 TABLE */}
      <div className="bg-white/10 backdrop-blur rounded-xl border border-white/20 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2 text-left">Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((t) => (
              <tr key={t.id} className="border-b border-gray-800">
                <td className="py-2">{t.category}</td>
                <td
                  className={`${
                    t.type === "Income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.type}
                </td>
                <td>{t.amount}</td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ℹ️ INFO */}
      <div className="bg-indigo-600/20 border border-indigo-500 rounded-xl p-6">
        <p className="text-gray-300">
          Dynamic Admin Panel: All data is now connected with your transaction system.
        </p>
      </div>

    </div>
  );
}

export default AdminDashboard;
