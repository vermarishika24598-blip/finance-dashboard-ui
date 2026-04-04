function Insights({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Insights</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Highest spending category
  const expenseTxns = transactions.filter((t) => t.type === "Expense");
  const categoryTotals = {};
  expenseTxns.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + parseInt(t.amount.replace("₹", ""));
  });
  const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  // Monthly comparison (simple demo: April vs March)
  const aprilTotal = transactions
    .filter((t) => t.date.startsWith("2026-04"))
    .reduce((sum, t) => sum + parseInt(t.amount.replace("₹", "")), 0);

  const marchTotal = transactions
    .filter((t) => t.date.startsWith("2026-03"))
    .reduce((sum, t) => sum + parseInt(t.amount.replace("₹", "")), 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Insights</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Highest spending category: <strong>{highestCategory}</strong></li>
        <li>March total: ₹{marchTotal}</li>
        <li>April total: ₹{aprilTotal}</li>
        <li>
          {aprilTotal > marchTotal
            ? "Spending increased in April compared to March."
            : "Spending decreased in April compared to March."}
        </li>
      </ul>
    </div>
  );
}

export default Insights;
