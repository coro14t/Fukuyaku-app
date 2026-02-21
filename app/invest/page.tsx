"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InvestPage() {
  const data = {
    labels: ["1月", "2月", "3月", "4月", "5月"],
    datasets: [
      {
        label: "資産推移",
        data: [1000000, 1100000, 1050000, 1200000, 1300000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>投資成績</h1>
      <Line data={data} />
    </div>
  );
}