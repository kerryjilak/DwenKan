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

export default function VoltageChart({ time, voltage, spikes, params }) {
  if (!time || !voltage) return null;

  // Downsample for performance if too many points
  const maxPoints = 2000;
  let displayTime = time;
  let displayVoltage = voltage;

  if (time.length > maxPoints) {
    const step = Math.ceil(time.length / maxPoints);
    displayTime = time.filter((_, i) => i % step === 0);
    displayVoltage = voltage.filter((_, i) => i % step === 0);
  }

  const data = {
    labels: displayTime.map((t) => t.toFixed(1)),
    datasets: [
      {
        label: 'Membrane Voltage (mV)',
        data: displayVoltage,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0,
        fill: true,
      },
      // Threshold line
      {
        label: `Threshold (${params?.V_threshold ?? -55} mV)`,
        data: displayTime.map(() => params?.V_threshold ?? -55),
        borderColor: '#ef4444',
        borderWidth: 1,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
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
        text: `Voltage Trace — ${spikes?.length ?? 0} spikes detected`,
        color: '#f3f4f6',
        font: { size: 14 },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time (ms)', color: '#9ca3af' },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 20,
        },
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
    <div className="bg-gray-900 rounded-xl p-4 h-80">
      <Line data={data} options={options} />
    </div>
  );
}
