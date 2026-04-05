import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import LineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import Insights from "../components/Insights";
import { motion } from "framer-motion";

function Dashboard() {
  const {
    transactions,
    search,
    setSearch,
    filterType,
    setFilterType,
    role,
    setRole,
    addTransaction,
    filterCategory,
    setFilterCategory,
    dateRange,
    setDateRange,
  } = useFinance();

  // ✅ Modal State
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Income");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
  });

  // ✅ Filters
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.category.toLowerCase().includes(search.toLowerCase()) ||
      txn.type.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "All" ? true : txn.type === filterType;

    const matchesCategory =
      filterCategory === "All" ? true : txn.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // ✅ Dynamic Calculations
  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] border-r border-gray-800 p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">💰 Finance</h1>

        <div className="mt-auto">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-[#1e293b] p-2 rounded-lg"
          >
            <option value="Viewer">Viewer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Top */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">

  {/* 🔍 Search */}
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="p-2 border rounded"
  />

  {/* 📂 Category */}
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="All">All Categories</option>
    {[...new Set(transactions.map(t => t.category))].map((cat) => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  {/* 💸 Type */}
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="All">All</option>
    <option value="Income">Income</option>
    <option value="Expense">Expense</option>
  </select>

  {/* 📅 Date */}
  <select
    value={dateRange}
    onChange={(e) => setDateRange(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="All">All Time</option>
    <option value="7">Last 7 Days</option>
    <option value="30">Last 30 Days</option>
  </select>

  {/* 📊 Sort */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="Date">Latest</option>
    <option value="Oldest">Oldest</option>
    <option value="High">Highest Amount</option>
    <option value="Low">Lowest Amount</option>
  </select>

</div>     
        </div>

        {/* 🔥 Dynamic Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Balance", value: `₹${balance}`, color: "text-white" },
            { label: "Income", value: `₹${income}`, color: "text-green-400" },
            { label: "Expense", value: `₹${expense}`, color: "text-red-400" },
          ].map((card, i) => (
            <div key={i} className="p-5 bg-[#0f172a] rounded-xl">
              <p className="text-gray-400">{card.label}</p>
              <h2 className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* 🔥 Add Buttons */}
        {role === "Admin" && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setType("Income");
                setShowModal(true);
              }}
              className="bg-green-500 px-4 py-2 rounded"
            >
              + Income
            </button>

            <button
              onClick={() => {
                setType("Expense");
                setShowModal(true);
              }}
              className="bg-red-500 px-4 py-2 rounded"
            >
              + Expense
            </button>
          </div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <LineChart />
          <PieChart />
        </div>

        {/* Table */}
        <div className="bg-[#0f172a] p-5 rounded-xl mb-8">
          <h2 className="mb-4">Transactions</h2>

          <table className="w-full">
            <thead>
              <tr className="text-gray-400">
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((txn, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td>{txn.date}</td>
                  <td>{txn.category}</td>
                  <td>{txn.type}</td>
                  <td>₹{txn.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Insights */}
        <Insights transactions={transactions} />

        {/* 🔥 Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#0f172a] p-6 rounded-xl w-80">
              <h2 className="mb-4">Add {type}</h2>

              <input
                type="number"
                placeholder="Amount"
                className="w-full mb-3 p-2 bg-[#020617]"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Category"
                className="w-full mb-3 p-2 bg-[#020617]"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full mb-4 p-2 bg-[#020617]"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    addTransaction({
                      ...form,
                      type,
                      amount: Number(form.amount),
                    });

                    setShowModal(false);
                    setForm({ amount: "", category: "", date: "" });
                  }}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
