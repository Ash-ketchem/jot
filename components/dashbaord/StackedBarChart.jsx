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

const StackedBarChart = ({ data, Xlabel, Ylabel, heading }) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: heading,
        font: {
          size: 18,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: Xlabel,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: Ylabel,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default StackedBarChart;
