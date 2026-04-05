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

  // 🔐 ROLE (change here)
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
      return new Date(b.date) - new Date(a.date); // ✅ FIX
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
    <div className="p-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] min-h-screen">

      {/* 🔐 ROLE SWITCH (ADD HERE 👇) */}
    <div className="mb-4 flex gap-4 items-center">

      <span className="px-3 py-1 bg-black text-white rounded">
        Role: {role}
      </span>

      <button
        onClick={() =>
          setRole(role === "Admin" ? "Viewer" : "Admin")
        }
        className="bg-purple-500 text-white px-4 py-1 rounded"
      >
        Switch to {role === "Admin" ? "Viewer" : "Admin"}
      </button>

    </div>

      {/* 🔍 FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">

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

        <div className="bg-indigo-600/20 text-white p-5 rounded-xl shadow">
          <h2>Total Income</h2>
          <p className="text-2xl font-bold">₹{totalIncome}</p>
        </div>

        <div className="bg-indigo-600/20 text-white p-5 rounded-xl shadow">
          <h2>Total Expense</h2>
          <p className="text-2xl font-bold">₹{totalExpense}</p>
        </div>

        <div className="bg-indigo-600/20 text-white p-5 rounded-xl shadow">
          <h2>Balance</h2>
          <p className="text-2xl font-bold">₹{balance}</p>
        </div>

      </div>

      {/* ➕ ADMIN ONLY BUTTONS */}
      {role === "Admin" && (
        <div className="mb-6 flex gap-4">

          <button
            onClick={() => {
              setType("Income");
              setShowModal(true);
            }}
            className="bg-green-500 text-white px-5 py-2 rounded-lg shadow"
          >
            + Add Income
          </button>

          <button
            onClick={() => {
              setType("Expense");
              setShowModal(true);
            }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow"
          >
            + Add Expense
          </button>

        </div>
      )}

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <LineChart transactions={filteredTransactions} />
        <PieChart transactions={filteredTransactions} />
      </div>

      {/* 📋 TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Category</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="text-center border-t hover:bg-gray-50">
                <td className="p-3">{t.date}</td>
                <td className="p-3">{t.category}</td>
                <td
                  className={`p-3 font-semibold ${
                    t.type === "Income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type}
                </td>
                <td className="p-3">{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL (ADMIN ONLY SAFE) */}
      {showModal && role === "Admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow">

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
