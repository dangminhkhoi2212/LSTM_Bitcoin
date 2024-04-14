import React from "react";
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
import useBearStore from "../store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function MyChart() {
  const predictData = useBearStore((state) => state.predictData);
  const originData = useBearStore((state) => state.originData);

  const newPredictData = [...predictData];
  newPredictData.unshift(originData[originData.length - 1]);
  const finalData = [...originData, ...newPredictData];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        position: "top",
        font: {
          size: 20,
        },
        text: "Biểu đồ dự đoán giá cao nhất của bitcoin trong những ngày tiếp theo",
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: "USD",
        },
      },
      x: {
        display: true,
        title: {
          display: true,
          text: "Ngày",
        },
      },
    },
  };
  const labels = finalData.map((_, index) => index + 1);
  labels.pop();
  const data = {
    labels,
    datasets: [
      {
        label: "USD (Origin)",
        data: originData.map((value, index) => ({ x: index + 1, y: value })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "USD (Predict)",
        data: newPredictData.map((value, index) => ({
          x: originData.length - 1 + index + 1,
          y: value,
        })),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };
  return (
    <div className="max-h-[500px] w-full flex flex-1 justify-center items-center">
      {" "}
      <Line options={options} data={data} />
    </div>
  );
}
