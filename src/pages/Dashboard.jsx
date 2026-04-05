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

  // 🔥 INSIGHTS
  const categorySpend = {};
  filteredTransactions.forEach((t) => {
    if (t.type === "Expense") {
      categorySpend[t.category] =
        (categorySpend[t.category] || 0) + getAmount(t.amount);
    }
  });

  const topCategory = Object.keys(categorySpend).reduce((a, b) =>
    categorySpend[a] > categorySpend[b] ? a : b,
    "N/A"
  );

  // ➕ ADD
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
    <div className="p-6 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] min-h-screen text-white">

      {/* 🔐 ROLE SWITCH */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Finance Dashboard</h1>

        <button
          onClick={() =>
            setRole(role === "Admin" ? "Viewer" : "Admin")
          }
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
        >
          {role}
        </button>
      </div>

      {/* 🔍 FILTERS */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl mb-6 flex flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-white/20 outline-none"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded bg-white/20"
        >
          <option value="All">All Categories</option>
          {[...new Set(transactions.map((t) => t.category))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 rounded bg-white/20"
        >
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 rounded bg-white/20"
        >
          <option value="All">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded bg-white/20"
        >
          <option value="Date">Latest</option>
          <option value="Oldest">Oldest</option>
          <option value="High">High</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* 💰 CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">

        {[{
          title: "Income",
          value: totalIncome,
          color: "from-green-500 to-emerald-500"
        },{
          title: "Expense",
          value: totalExpense,
          color: "from-red-500 to-pink-500"
        },{
          title: "Balance",
          value: balance,
          color: "from-indigo-500 to-purple-500"
        }].map((card, i) => (
          <div key={i} className={`p-5 rounded-xl bg-gradient-to-r ${card.color} shadow-lg hover:scale-105 transition`}>
            <h2>{card.title}</h2>
            <p className="text-2xl font-bold">₹{card.value}</p>
          </div>
        ))}

      </div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <LineChart transactions={filteredTransactions} />
        <PieChart transactions={filteredTransactions} />
      </div>

      {/* 🔥 INSIGHTS */}
      <div className="bg-white/10 p-4 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Insights</h2>
        <p>Top Spending Category: {topCategory}</p>
        <p>Total Transactions: {filteredTransactions.length}</p>
      </div>

      {/* ➕ ADMIN */}
      {role === "Admin" && (
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setType("Income");
              setShowModal(true);
            }}
            className="bg-green-500 px-5 py-2 rounded-lg hover:scale-105 transition"
          >
            + Income
          </button>

          <button
            onClick={() => {
              setType("Expense");
              setShowModal(true);
            }}
            className="bg-red-500 px-5 py-2 rounded-lg hover:scale-105 transition"
          >
            + Expense
          </button>
        </div>
      )}

      {/* 📋 TABLE */}
      <div className="bg-white/10 rounded-xl overflow-auto">
        <table className="w-full text-center">
          <thead className="bg-white/20">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Category</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-gray-400">
                  No transactions found 🚫
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="border-t border-white/10 hover:bg-white/10">
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>
                  <td className={`p-3 font-semibold ${
                    t.type === "Income" ? "text-green-400" : "text-red-400"
                  }`}>
                    {t.type}
                  </td>
                  <td className="p-3">{t.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-[#0f172a] p-6 rounded-xl w-80">

            <h2 className="mb-4 text-center font-bold">
              Add {type}
            </h2>

            <input
              placeholder="Amount"
              className="p-2 w-full mb-3 rounded bg-white/20"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              className="p-2 w-full mb-3 rounded bg-white/20"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <input
              type="date"
              className="p-2 w-full mb-4 rounded bg-white/20"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={handleAdd}
                className="bg-indigo-500 px-4 py-2 rounded"
              >
                Add
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 px-4 py-2 rounded"
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
