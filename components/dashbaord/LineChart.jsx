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

const LineChart = ({
  labels,
  data: userCount,
  heading,
  Xlabel,
  Ylabel,
  label,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: userCount,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color under the line
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        borderWidth: 2, // Line width
        tension: 0.1, // Line curve tension (0 fo
      },
    ],
  };
  //

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      x: {
        title: {
          display: true,
          text: Xlabel,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: Ylabel,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
