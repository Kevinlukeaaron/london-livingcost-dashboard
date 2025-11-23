import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CostBreakdownChart({ rent, utilities, groceries, transport }) {
  const total = rent + utilities + groceries + transport;

  if (!total) {
    return <p style={{ color: "#8b8fa3", fontSize: 13 }}>Run an estimate to see the breakdown.</p>;
  }

  const data = {
    labels: ["Rent", "Utilities", "Groceries", "Transport"],
    datasets: [
      {
        data: [rent, utilities, groceries, transport],
        backgroundColor: ["#6366f1", "#22c55e", "#eab308", "#f97316"],
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: 360 }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default CostBreakdownChart;
