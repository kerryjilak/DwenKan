import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(245, 158, 11, 0.8)',
  'rgba(16, 185, 129, 0.8)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(139, 92, 246, 0.8)',
];

export default function AIVisualization({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Network Architecture</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {result.architecture.map((desc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="bg-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-full border border-gray-700">
                {desc}
              </span>
              {idx < result.architecture.length - 1 && (
                <span className="text-gray-600">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layer Activations */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Layer Activations</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(result.layer_activations.length, 4)}, 1fr)` }}>
          {result.layer_activations.map((la, idx) => (
            <ActivationBarChart
              key={idx}
              layerName={la.layer_name}
              values={la.values[0]}
              color={COLORS[idx % COLORS.length]}
            />
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Output</h3>
        <div className="flex gap-3">
          {result.output[0].map((val, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg px-4 py-2 text-center">
              <div className="text-lg font-mono font-bold text-purple-400">
                {val.toFixed(4)}
              </div>
              <div className="text-xs text-gray-500">Output {idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivationBarChart({ layerName, values, color }) {
  const data = {
    labels: values.map((_, i) => `N${i + 1}`),
    datasets: [
      {
        label: layerName,
        data: values,
        backgroundColor: color,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: layerName,
        color: '#d1d5db',
        font: { size: 12 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#6b7280', font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#6b7280', font: { size: 10 } },
        grid: { color: 'rgba(75, 85, 99, 0.3)' },
      },
    },
  };

  return (
    <div className="h-40">
      <Bar data={data} options={options} />
    </div>
  );
}
