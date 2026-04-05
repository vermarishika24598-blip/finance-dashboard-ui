import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import LineChart from "../components/LineChart";

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

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Income");

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: "",
  });

  // ✅ Safe amount parser
  const getAmount = (amt) => {
    if (!amt) return 0;
    return parseInt(amt.toString().replace("₹", "")) || 0;
  };

  // 🔥 FILTER + SORT LOGIC
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
      return new Date(b.date);
    });

  // 🔥 CARD VALUES
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // ➕ ADD TRANSACTION
  const handleAdd = () => {
    addTransaction({
      ...formData,
      type,
      amount: "₹" + formData.amount,
    });

    setShowModal(false);
    setFormData({ amount: "", category: "", date: "" });
  };

  return (
    <div className="p-6">

      {/* 🔥 FILTERS */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">

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

      {/* 🔥 CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">Income: ₹{totalIncome}</div>
        <div className="bg-red-100 p-4 rounded">Expense: ₹{totalExpense}</div>
        <div className="bg-blue-100 p-4 rounded">Balance: ₹{balance}</div>
      </div>

      {/* ➕ BUTTONS */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => {
            setType("Income");
            setShowModal(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Income
        </button>

        <button
          onClick={() => {
            setType("Expense");
            setShowModal(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      <LineChart transactions={filteredTransactions} />

      {/* 📋 TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} className="text-center border-t">
              <td>{t.date}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="mb-4 font-bold">Add {type}</h2>

            <input
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              placeholder="Category"
              className="border p-2 w-full mb-2"
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
