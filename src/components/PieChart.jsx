import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ transactions }) {

  const getAmount = (amt) => {
    if (!amt) return 0;
    return parseInt(amt.toString().replace("₹", "")) || 0;
  };

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + getAmount(t.amount), 0);

  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="mb-4 font-semibold">Income vs Expense</h2>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;
