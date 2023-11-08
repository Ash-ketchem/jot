"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, heading }) => {
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
  };
  return <Doughnut data={data} options={options} />;
};

export default PieChart;
