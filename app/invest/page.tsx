"use client";

import { useState } from "react";
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
  const [amount, setAmount] = useState("");
  const [dataPoints, setDataPoints] = useState<number[]>([1000000]);
  const [labels, setLabels] = useState<string[]>(["開始"]);

  const addData = () => {
    if (!amount) return;

    const newValue = Number(amount);
    const updatedData = [...dataPoints, newValue];
    const updatedLabels = [...labels, `${labels.length}回目`];

    setDataPoints(updatedData);
    setLabels(updatedLabels);
    setAmount("");
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "資産推移",
        data: dataPoints,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px" }}>
      <h1>投資成績ビュー</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="現在の資産額を入力"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "8px", width: "70%" }}
        />
        <button
          onClick={addData}
          style={{
            padding: "8px 12px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </div>

      <Line data={data} />
    </div>
  );
}