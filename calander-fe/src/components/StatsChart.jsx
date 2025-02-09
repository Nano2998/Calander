import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 데이터 라벨 플러그인

// Chart.js 요소 및 플러그인 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const StatsChart = ({ completionRate, inProgressRate, completedCount, inProgressCount }) => {
  const data = {
    labels: ["완료된 일정", "남은 일정"],
    datasets: [
      {
        data: [completionRate, inProgressRate],
        backgroundColor: ["#4caf50", "#f44336"], // 녹색: 완료, 빨강: 남음
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // 범례 위치: 위쪽
      },
      datalabels: {
        color: "#000", // 라벨 색상
        font: {
          size: 12, // 글자 크기
          weight: "bold", // 글자 두께
        },
        formatter: (value, context) => {
          // 데이터를 비율(%) + 개수 형식으로 표시
          const label = context.chart.data.labels[context.dataIndex];
          const count =
            label === "완료된 일정" ? completedCount : inProgressCount;
          return `${value.toFixed(2)}%\n(${count}개)`;
        },
        anchor: "end", // 라벨 위치
        align: "start", // 라벨 정렬
      },
    },
  };

  // 차트 크기 스타일 적용
  const chartStyle = {
    width: "250px", // 차트 너비
    height: "250px", // 차트 높이
    margin: "0 auto", // 중앙 정렬
  };

  return (
    <div style={chartStyle}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatsChart;