import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const data = {
    labels: ["Food", "Transport", "Shopping", "Bills"],
    datasets: [
      {
        label: "Spending Breakdown",
        data: [5000, 2000, 7000, 3000],
        backgroundColor: [
          "rgb(239, 68, 68)",   // red-500
          "rgb(34, 197, 94)",   // green-500
          "rgb(59, 130, 246)",  // blue-500
          "rgb(234, 179, 8)",   // yellow-500
        ],
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Spending Breakdown</h2>
      <Pie data={data} />
    </div>
  );
}

export default PieChart;
