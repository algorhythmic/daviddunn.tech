'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  maintainAspectRatio: false,
};

const data = {
  labels: ['Home', 'Blog', 'Photos', 'About', 'Apps'],
  datasets: [
    {
      label: 'Page Views',
      data: [1200, 900, 800, 500, 400],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function BarChart() {
  return (
    <div style={{ height: '300px' }}>
      <Bar options={options} data={data} />
    </div>
  );
}
