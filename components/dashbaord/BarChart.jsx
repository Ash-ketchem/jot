"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, data, heading, xLabel, yLabel, bgColor }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: heading,
        font: {
          size: 18, // Set the y-axis tick font size
          color: "rgba(0, 0, 0,)", // Set the y-axis tick font color
          weight: "bold", // Set the y-axis tick font weight to bold
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yLabel,
        },
        ticks: {
          font: {
            size: 14, // Set the y-axis tick font size
            color: "rgba(0, 0, 0,)", // Set the y-axis tick font color
            weight: "bold", // Set the y-axis tick font weight to bold
          },
        },
      },
      x: {
        title: {
          display: true,
          text: xLabel,
        },
        ticks: {
          font: {
            size: 14, // Set the x-axis tick font size
            color: "rgba(0, 0, 0,)", // Set the x-axis tick font color
            weight: "bold", // Set the x-axis tick font weight to bold
          },
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "posts",
        data: data,

        backgroundColor: bgColor ?? "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};

export default BarChart;
