import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const StatsChart = ({ completionRate, inProgressRate, completedCount, inProgressCount }) => {
  const data = {
    labels: ["완료된 일정", "남은 일정"],
    datasets: [
      {
        data: [completionRate, inProgressRate],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        color: "#000",
        font: {
          size: 12,
          weight: "bold",
        },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          const count = label === "완료된 일정" ? completedCount : inProgressCount;
          return `${value.toFixed(2)}%\n(${count}개)`;
        },
        anchor: "end",
        align: "start",
      },
    },
  };

  const chartStyle = {
    width: "250px",
    height: "250px",
    margin: "0 auto",
  };

  return (
    <div style={chartStyle}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatsChart;