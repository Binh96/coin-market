import React from "react";
import "./Chart.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

function ChartComponent() {
  const data = {
    labels: ["1000", "2000", "3000", "4000", "5000", "6000", "7000"],
    datasets: [
      {
        label: "Coin Value",
        data: [200, 300, 250, 400, 370, 420, 380],
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        pointBackgroundColor: "white",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#0d1427",
        borderColor: "cyan",
        borderWidth: 1,
        titleColor: "cyan",
        bodyColor: "white",
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,255,255,0.2)",
        },
        ticks: {
          color: "cyan",
        },
      },
      y: {
        grid: {
          color: "rgba(0,255,255,0.2)",
        },
        ticks: {
          color: "cyan",
        },
      },
    },
  };

   return (
    <div className="chart-box">
      <Line data={data} options={options} />
    </div>
  );
}

export default ChartComponent;