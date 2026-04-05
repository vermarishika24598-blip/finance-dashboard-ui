import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";

function AdminDashboard() {
  const { transactions, setTransactions } = useFinance();

  const [editingTxn, setEditingTxn] = useState(null);

  // 💰 calculations
  const totalTransactions = transactions.length;

  const totalRevenue = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + parseInt(t.amount.replace("₹", "")), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + parseInt(t.amount.replace("₹", "")), 0);

  // 📊 Top category
  const categoryMap = {};
  transactions.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += parseInt(t.amount.replace("₹", ""));
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // 🧾 Recent
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // 🗑️ DELETE
  const handleDelete = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
  };

  // ✏️ EDIT SAVE
  const handleSave = () => {
    const updated = transactions.map((t) =>
      t.id === editingTxn.id ? editingTxn : t
    );
    setTransactions(updated);
    setEditingTxn(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard ⚡</h1>

      {/* 📊 CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white/10 p-5 rounded-xl border">
          <p className="text-gray-400 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold">{totalTransactions}</h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl border">
          <p className="text-gray-400 text-sm">Revenue</p>
          <h2 className="text-2xl text-green-400 font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl border">
          <p className="text-gray-400 text-sm">Expenses</p>
          <h2 className="text-2xl text-red-400 font-bold">
            ₹{totalExpense}
          </h2>
        </div>

        <div className="bg-white/10 p-5 rounded-xl border">
          <p className="text-gray-400 text-sm">Top Category</p>
          <h2 className="text-xl font-bold">{topCategory}</h2>
        </div>

      </div>

      {/* 📋 TABLE */}
      <div className="bg-white/10 rounded-xl p-6 border mb-8">
        <h2 className="mb-4 text-lg font-semibold">Manage Transactions</h2>

        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b">
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">

                <td>{t.category}</td>

                <td className={t.type === "Income" ? "text-green-400" : "text-red-400"}>
                  {t.type}
                </td>

                <td>{t.amount}</td>
                <td>{t.date}</td>

                <td className="flex gap-2">

                  <button
                    onClick={() => setEditingTxn(t)}
                    className="bg-yellow-500 px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editingTxn && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white text-black p-6 rounded-xl w-80">

            <h2 className="mb-4 font-bold">Edit Transaction</h2>

            <input
              className="border p-2 w-full mb-2"
              value={editingTxn.category}
              onChange={(e) =>
                setEditingTxn({ ...editingTxn, category: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editingTxn.amount.replace("₹", "")}
              onChange={(e) =>
                setEditingTxn({
                  ...editingTxn,
                  amount: "₹" + e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border p-2 w-full mb-4"
              value={editingTxn.date}
              onChange={(e) =>
                setEditingTxn({ ...editingTxn, date: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingTxn(null)}
                className="bg-gray-400 px-4 py-2 rounded"
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

export default AdminDashboard;
