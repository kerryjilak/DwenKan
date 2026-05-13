import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7',
];

export default function NetworkChart({ time, voltages, spikes, neuronIds }) {
  if (!time || !voltages) return null;

  const maxPoints = 2000;
  let displayTime = time;
  let step = 1;
  if (time.length > maxPoints) {
    step = Math.ceil(time.length / maxPoints);
    displayTime = time.filter((_, i) => i % step === 0);
  }

  const datasets = neuronIds.map((nid, idx) => {
    let displayVoltage = voltages[nid];
    if (step > 1) {
      displayVoltage = voltages[nid].filter((_, i) => i % step === 0);
    }
    return {
      label: `Neuron ${nid} (${spikes[nid]?.length ?? 0} spikes)`,
      data: displayVoltage,
      borderColor: COLORS[idx % COLORS.length],
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0,
      fill: false,
    };
  });

  const data = {
    labels: displayTime.map((t) => t.toFixed(1)),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        labels: { color: '#d1d5db' },
      },
      title: {
        display: true,
        text: 'Network Voltage Traces',
        color: '#f3f4f6',
        font: { size: 14 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time (ms)', color: '#9ca3af' },
        ticks: { color: '#6b7280', maxTicksLimit: 20 },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
      y: {
        title: { display: true, text: 'Voltage (mV)', color: '#9ca3af' },
        ticks: { color: '#6b7280' },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 h-96">
      <Line data={data} options={options} />
    </div>
  );
}
