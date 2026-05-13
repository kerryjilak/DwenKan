import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip);

export default function SpikeRaster({ spikes }) {
  if (!spikes || spikes.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 h-32 flex items-center justify-center text-gray-500">
        No spikes detected — try increasing input current or duration
      </div>
    );
  }

  const data = {
    datasets: [
      {
        label: 'Spikes',
        data: spikes.map((t) => ({ x: t, y: 1 })),
        backgroundColor: '#f59e0b',
        pointRadius: 6,
        pointStyle: 'line',
        borderColor: '#f59e0b',
        borderWidth: 2,
        showLine: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Spike Raster — ${spikes.length} events`,
        color: '#f3f4f6',
        font: { size: 14 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `Spike at ${ctx.parsed.x.toFixed(1)} ms`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time (ms)', color: '#9ca3af' },
        ticks: { color: '#6b7280' },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
      y: {
        display: false,
        min: 0,
        max: 2,
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 h-32">
      <Scatter data={data} options={options} />
    </div>
  );
}
