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

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const balance = totalIncome - totalExpense;

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
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">

      {/* 🔐 ROLE SWITCH */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard ⚡</h1>

        <div className="flex gap-3 items-center">
          <span className="px-4 py-1 bg-white/10 rounded-full text-sm">
            {role}
          </span>

          <button
            onClick={() =>
              setRole(role === "Admin" ? "Viewer" : "Admin")
            }
            className="bg-indigo-500 px-4 py-1 rounded-full hover:bg-indigo-600"
          >
            Switch
          </button>
        </div>
      </div>

      {/* 🔍 FILTERS */}
      <div className="bg-white/10 backdrop-blur p-4 rounded-xl mb-6 flex flex-wrap gap-4 border border-white/20">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-white/10 border border-white/20 text-white"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="All">All Categories</option>
          {[...new Set(transactions.map((t) => t.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="All">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded bg-white/10 border border-white/20"
        >
          <option value="Date">Latest</option>
          <option value="Oldest">Oldest</option>
          <option value="High">High</option>
          <option value="Low">Low</option>
        </select>

      </div>

      {/* 💰 CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        <div className="bg-green-500/20 p-5 rounded-xl border border-green-400/30">
          <h2>Total Income</h2>
          <p className="text-2xl font-bold text-green-400">₹{totalIncome}</p>
        </div>

        <div className="bg-red-500/20 p-5 rounded-xl border border-red-400/30">
          <h2>Total Expense</h2>
          <p className="text-2xl font-bold text-red-400">₹{totalExpense}</p>
        </div>

        <div className="bg-indigo-500/20 p-5 rounded-xl border border-indigo-400/30">
          <h2>Balance</h2>
          <p className="text-2xl font-bold text-indigo-300">₹{balance}</p>
        </div>

      </div>

      {/* ➕ ADMIN BUTTONS */}
      {role === "Admin" && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setType("Income");
              setShowModal(true);
            }}
            className="bg-green-500 px-5 py-2 rounded-lg"
          >
            + Income
          </button>

          <button
            onClick={() => {
              setType("Expense");
              setShowModal(true);
            }}
            className="bg-red-500 px-5 py-2 rounded-lg"
          >
            + Expense
          </button>
        </div>
      )}

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 p-4 rounded-xl">
          <LineChart transactions={filteredTransactions} />
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <PieChart transactions={filteredTransactions} />
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="bg-white/10 rounded-xl overflow-hidden border border-white/20">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="text-center border-t border-white/10">
                <td className="p-3">{t.date}</td>
                <td>{t.category}</td>
                <td className={t.type === "Income" ? "text-green-400" : "text-red-400"}>
                  {t.type}
                </td>
                <td>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && role === "Admin" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-xl w-80">

            <h2 className="mb-4 text-lg font-bold text-center">
              Add {type}
            </h2>

            <input
              placeholder="Amount"
              className="border p-2 w-full mb-3"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              className="border p-2 w-full mb-3"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <input
              type="date"
              className="border p-2 w-full mb-4"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Add
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 px-4 py-2"
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
