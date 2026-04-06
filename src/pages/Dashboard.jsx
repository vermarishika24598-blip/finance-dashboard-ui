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

  // Helper to format numbers with commas
  const formatCurrency = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans">
      {/* 🔐 Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-400 drop-shadow-lg mb-3 md:mb-0">
          Finance Dashboard
        </h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-indigo-600/30 hover:bg-indigo-600/50 text-white px-4 py-2 rounded-full transition"
        >
          <option value="Admin">Admin</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* 🔍 Filters */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-6 flex flex-wrap gap-3 shadow-lg">
        <input
          type="text"
          placeholder="Search by Category or Type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/20 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

         <select
  value={filterCategory}
  onChange={(e) => setFilterCategory(e.target.value)}
  className="p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
>
  <option value="All" className="bg-gray-800 text-white">
    All Categories
  </option>
  {[...new Set(transactions.map((t) => t.category))].map((cat) => (
    <option key={cat} className="bg-gray-800 text-white">
      {cat}
    </option>
  ))}
</select>

<select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
>
  <option value="All" className="bg-gray-800 text-white">
    All Types
  </option>
  <option value="Income" className="bg-gray-800 text-white">
    Income
  </option>
  <option value="Expense" className="bg-gray-800 text-white">
    Expense
  </option>
</select>

<select
  value={dateRange}
  onChange={(e) => setDateRange(e.target.value)}
  className="p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
>
  <option value="All" className="bg-gray-800 text-white">
    All Time
  </option>
  <option value="7" className="bg-gray-800 text-white">
    Last 7 Days
  </option>
  <option value="30" className="bg-gray-800 text-white">
    Last 30 Days
  </option>
</select>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none"
>
  <option value="Date" className="bg-gray-800 text-white">
    Latest
  </option>
  <option value="Oldest" className="bg-gray-800 text-white">
    Oldest
  </option>
  <option value="High" className="bg-gray-800 text-white">
    High
  </option>
  <option value="Low" className="bg-gray-800 text-white">
    Low
  </option>
</select>
        
              </div>

      {/* 💰 Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {[
          { title: "Income", value: totalIncome, color: "from-green-500 to-emerald-500" },
          { title: "Expense", value: totalExpense, color: "from-red-500 to-pink-500" },
          { title: "Balance", value: balance, color: "from-indigo-500 to-purple-500" },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl bg-gradient-to-r ${card.color} shadow-2xl hover:scale-105 transition transform`}
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-2xl md:text-3xl font-bold mt-2">
              {formatCurrency(card.value)}
            </p>
          </div>
        ))}
      </div>

      {/* 📊 Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-2 text-indigo-300">Transaction Trend</h2>
          <LineChart transactions={filteredTransactions} />
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-2 text-indigo-300">Expense Distribution</h2>
          <PieChart transactions={filteredTransactions} />
        </div>
      </div>

      {/* 🔥 Insights */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-6 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-700/30 rounded-xl">
          <p className="text-gray-300 text-sm">Top Spending Category</p>
          <p className="text-lg font-bold">{topCategory}</p>
        </div>
        <div className="p-4 bg-green-700/30 rounded-xl">
          <p className="text-gray-300 text-sm">Total Transactions</p>
          <p className="text-lg font-bold">{filteredTransactions.length}</p>
        </div>
        <div className="p-4 bg-pink-700/30 rounded-xl">
          <p className="text-gray-300 text-sm">Net Balance</p>
          <p className="text-lg font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* ➕ Admin Buttons */}
      {role === "Admin" && (
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setType("Income");
              setShowModal(true);
            }}
            className="bg-green-500 px-6 py-3 rounded-xl hover:scale-105 transition transform shadow-lg"
          >
            + Income
          </button>
          <button
            onClick={() => {
              setType("Expense");
              setShowModal(true);
            }}
            className="bg-red-500 px-6 py-3 rounded-xl hover:scale-105 transition transform shadow-lg"
          >
            + Expense
          </button>
        </div>
      )}

      {/* 📋 Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-auto shadow-lg mb-6">
        <table className="w-full text-center border-separate border-spacing-y-2">
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
                <tr
                  key={t.id}
                  className="hover:bg-white/10 transition rounded-lg"
                >
                  <td className="p-3">{t.date}</td>
                  <td className="p-3">{t.category}</td>
                  <td
                    className={`p-3 font-semibold ${
                      t.type === "Income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="p-3">{t.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900/90 backdrop-blur-md p-6 rounded-2xl w-80 shadow-2xl">
            <h2 className="mb-4 text-center text-xl font-bold text-indigo-400">
              Add {type}
            </h2>

            <input
              placeholder="Amount"
              className="p-3 w-full mb-3 rounded-xl bg-white/10 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            <input
              placeholder="Category"
              className="p-3 w-full mb-3 rounded-xl bg-white/10 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              type="date"
              className="p-3 w-full mb-4 rounded-xl bg-white/10 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <div className="flex justify-between gap-4">
              <button
                onClick={handleAdd}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl transition shadow-lg"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl transition shadow-lg"
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
