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

  // Helper function for date range filter
const checkDateRange = (txnDate, range) => {
  const date = new Date(txnDate);
  const today = new Date();

  if (range === "Last7") {
    const last7 = new Date();
    last7.setDate(today.getDate() - 7);
    return date >= last7;
  }

  if (range === "ThisMonth") {
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  return true; // "All" case
};

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.category.toLowerCase().includes(search.toLowerCase()) ||
      txn.type.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === "All" ? true : txn.type === filterType;

    const matchesCategory =
      filterCategory === "All" ? true : txn.category === filterCategory;

    const matchesDate =
      dateRange === "All" ? true : checkDateRange(txn.date, dateRange);

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  
  

  // Export CSV
  const exportCSV = () => {
    const rows = [
      ["Date", "Category", "Type", "Amount"],
      ...transactions.map((t) => [t.date, t.category, t.type, t.amount]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };
  

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-64 bg-[#0f172a] border-r border-gray-800 p-6 hidden md:flex flex-col"
      >
        <h1 className="text-2xl font-bold mb-10">💰 Finance</h1>

        <nav className="space-y-4 text-gray-400">
          <p className="hover:text-white cursor-pointer">Dashboard</p>
          <p className="hover:text-white cursor-pointer">Transactions</p>
          <p className="hover:text-white cursor-pointer">Reports</p>
        </nav>

        <div className="mt-auto">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-[#1e293b] p-2 rounded-lg border border-gray-700"
          >
            <option value="Viewer">Viewer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </motion.div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between gap-4 mb-8"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700 focus:outline-none"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700"
            >
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Salary">Salary</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-700"
            >
              <option value="All">All Dates</option>
              <option value="Last7">Last 7 Days</option>
              <option value="ThisMonth">This Month</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Balance", value: "₹50,000", color: "text-white" },
            { label: "Income", value: "₹20,000", color: "text-green-400" },
            { label: "Expense", value: "₹10,000", color: "text-red-400" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="p-5 bg-[#0f172a] rounded-xl border border-gray-800"
            >
              <p className="text-gray-400 text-sm">{card.label}</p>
              <h2 className={`text-2xl font-bold mt-2 ${card.color}`}>
                {card.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0f172a] p-5 rounded-xl border border-gray-800"
          >
            <LineChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0f172a] p-5 rounded-xl border border-gray-800"
          >
            <PieChart />
          </motion.div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0f172a] p-5 rounded-xl border border-gray-800 mb-8"
        >
          <h2 className="mb-4 font-semibold">Transactions</h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th className="py-2 text-left">Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((txn, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="border-b border-gray-800"
                  >
                    <td className="py-2">{txn.date}</td>
                    <td>{txn.category}</td>
                    <td>
                      <span
                        className={`text-xs ${
                          txn.type === "Income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>
                    <td className="text-right font-semibold">
                      {txn.amount}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0f172a] p-5 rounded-xl border border-gray-800 mb-8"
        >
          <Insights transactions={transactions} />
        </motion.div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600"
        >
          Export to CSV
        </motion.button>

        {/* Button */}
        {role === "Admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              addTransaction({
                date: "2026-04-05",
                category: "Bills",
                type: "Expense",
                amount: "₹800",
              })
            }
            className="bg-indigo-500 px-5 py-2 rounded-lg hover:bg-indigo-600"
          >
            Add Transaction
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
