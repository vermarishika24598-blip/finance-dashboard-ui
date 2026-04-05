import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";

function Dashboard() {
  const {
    transactions,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    addTransaction,
  } = useFinance();

  // 🔐 ROLE SWITCH
  const [role, setRole] = useState("Admin");

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Income");

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
  });

  const getAmount = (amt) => {
    if (!amt) return 0;
    return parseInt(amt.toString().replace("₹", "")) || 0;
  };

  // 🔥 FILTER + SORT
  const filteredTransactions = transactions
    .filter((t) => {
      if (
        search &&
        !t.category.toLowerCase().includes(search.toLowerCase()) &&
        !t.type.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (filterType !== "All" && t.type !== filterType) return false;
      if (filterCategory !== "All" && t.category !== filterCategory)
        return false;

      if (dateRange !== "All") {
        const days = parseInt(dateRange);
        const txnDate = new Date(t.date);
        const now = new Date();
        const diff = (now - txnDate) / (1000 * 60 * 60 * 24);
        if (diff > days) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "High") return getAmount(b.amount) - getAmount(a.amount);
      if (sortBy === "Low") return getAmount(a.amount) - getAmount(b.amount);
      if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
      return new Date(b.date) - new Date(a.date);
    });

  // 💰 CALCULATIONS
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // ➕ ADD TRANSACTION
  const handleAdd = () => {
    if (role !== "Admin") {
      alert("Only Admin can add transactions");
      return;
    }

    addTransaction({
      ...formData,
      type,
      amount: "₹" + formData.amount,
    });

    setShowModal(false);
    setFormData({ amount: "", category: "", date: "" });
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100">

      {/* 🔐 HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Finance Dashboard
        </h1>

        <div className="flex gap-3 items-center">
          <span className="px-4 py-1 bg-black text-white rounded-full text-sm">
            {role}
          </span>

          <button
            onClick={() =>
              setRole(role === "Admin" ? "Viewer" : "Admin")
            }
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full shadow hover:scale-105 transition"
          >
            Switch
          </button>
        </div>
      </div>

      {/* 🔍 FILTERS */}
      <div className="backdrop-blur-lg bg-white/60 p-4 rounded-xl shadow-lg mb-6 flex flex-wrap gap-4 border border-white/40">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Categories</option>
          {[...new Set(transactions.map((t) => t.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Date">Latest</option>
          <option value="Oldest">Oldest</option>
          <option value="High">High Amount</option>
          <option value="Low">Low Amount</option>
        </select>

      </div>

      {/* 💰 CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-sm opacity-80">Total Income</p>
          <h2 className="text-3xl font-bold">₹{totalIncome}</h2>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-sm opacity-80">Total Expense</p>
          <h2 className="text-3xl font-bold">₹{totalExpense}</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <p className="text-sm opacity-80">Balance</p>
          <h2 className="text-3xl font-bold">₹{balance}</h2>
        </div>

      </div>

      {/* ➕ BUTTONS */}
      {role === "Admin" && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setType("Income");
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            + Income
          </button>

          <button
            onClick={() => {
              setType("Expense");
              setShowModal(true);
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            + Expense
          </button>
        </div>
      )}

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow">
          <LineChart transactions={filteredTransactions} />
        </div>
        <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow">
          <PieChart transactions={filteredTransactions} />
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="text-center border-t hover:bg-gray-100 transition">
                <td className="p-3">{t.date}</td>
                <td className="p-3">{t.category}</td>
                <td className={`p-3 font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type}
                </td>
                <td className="p-3">{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && role === "Admin" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-2xl">

            <h2 className="mb-4 text-lg font-bold text-center">
              Add {type}
            </h2>

            <input
              placeholder="Amount"
              className="border p-2 w-full mb-3 rounded"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              className="border p-2 w-full mb-3 rounded"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <input
              type="date"
              className="border p-2 w-full mb-4 rounded"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
