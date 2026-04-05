import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function LineChart({ transactions }) {

  const getAmount = (amt) => {
    if (!amt) return 0;
    return parseInt(amt.toString().replace("₹", "")) || 0;
  };

  // 📊 Group by date
  const grouped = {};

  transactions.forEach((t) => {
    const date = t.date;

    if (!grouped[date]) {
      grouped[date] = { income: 0, expense: 0 };
    }

    if (t.type === "Income") {
      grouped[date].income += getAmount(t.amount);
    } else {
      grouped[date].expense += getAmount(t.amount);
    }
  });

  const labels = Object.keys(grouped);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: labels.map((d) => grouped[d].income),
        borderColor: "green",
      },
      {
        label: "Expense",
        data: labels.map((d) => grouped[d].expense),
        borderColor: "red",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="mb-4 font-semibold">Transaction Trend</h2>
      <Line data={data} />
    </div>
  );
}

export default LineChart;
