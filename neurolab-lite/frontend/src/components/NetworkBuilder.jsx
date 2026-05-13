import { useState } from 'react';

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#a855f7',
];

export default function NetworkBuilder({ onRun, loading }) {
  const [neurons, setNeurons] = useState([
    { id: 'A', current: 20 },
    { id: 'B', current: 0 },
  ]);
  const [connections, setConnections] = useState([
    { source_id: 'A', target_id: 'B', weight: 15, delay: 2 },
  ]);
  const [duration, setDuration] = useState(100);

  const addNeuron = () => {
    const nextId = String.fromCharCode(65 + neurons.length);
    if (neurons.length < 10) {
      setNeurons([...neurons, { id: nextId, current: 0 }]);
    }
  };

  const removeNeuron = (idx) => {
    const removed = neurons[idx];
    setNeurons(neurons.filter((_, i) => i !== idx));
    setConnections(
      connections.filter(
        (c) => c.source_id !== removed.id && c.target_id !== removed.id
      )
    );
  };

  const updateNeuronCurrent = (idx, value) => {
    const updated = [...neurons];
    updated[idx] = { ...updated[idx], current: parseFloat(value) };
    setNeurons(updated);
  };

  const addConnection = () => {
    if (neurons.length >= 2) {
      setConnections([
        ...connections,
        { source_id: neurons[0].id, target_id: neurons[1].id, weight: 10, delay: 2 },
      ]);
    }
  };

  const removeConnection = (idx) => {
    setConnections(connections.filter((_, i) => i !== idx));
  };

  const updateConnection = (idx, field, value) => {
    const updated = [...connections];
    updated[idx] = {
      ...updated[idx],
      [field]: field === 'weight' || field === 'delay' ? parseFloat(value) : value,
    };
    setConnections(updated);
  };

  const handleSubmit = () => {
    const external_currents = {};
    neurons.forEach((n) => {
      if (n.current !== 0) external_currents[n.id] = n.current;
    });

    onRun({
      neurons: neurons.map((n) => ({ id: n.id })),
      connections,
      external_currents,
      dt: 0.1,
      duration,
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-white">Network Builder</h2>

      {/* Neurons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">Neurons</h3>
          <button
            onClick={addNeuron}
            disabled={neurons.length >= 10}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 px-2 py-1 rounded text-white cursor-pointer"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {neurons.map((n, idx) => (
            <div key={n.id} className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              >
                {n.id}
              </span>
              <label className="text-xs text-gray-400">I:</label>
              <input
                type="number"
                value={n.current}
                onChange={(e) => updateNeuronCurrent(idx, e.target.value)}
                className="w-16 bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-700"
              />
              <span className="text-xs text-gray-500">nA</span>
              {neurons.length > 1 && (
                <button
                  onClick={() => removeNeuron(idx)}
                  className="text-red-400 hover:text-red-300 text-xs ml-auto cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Connections */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">Connections</h3>
          <button
            onClick={addConnection}
            disabled={neurons.length < 2}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 px-2 py-1 rounded text-white cursor-pointer"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {connections.map((c, idx) => (
            <div key={idx} className="flex items-center gap-1 text-sm">
              <select
                value={c.source_id}
                onChange={(e) => updateConnection(idx, 'source_id', e.target.value)}
                className="bg-gray-800 text-white px-1 py-1 rounded border border-gray-700 text-xs"
              >
                {neurons.map((n) => (
                  <option key={n.id} value={n.id}>{n.id}</option>
                ))}
              </select>
              <span className="text-gray-500">→</span>
              <select
                value={c.target_id}
                onChange={(e) => updateConnection(idx, 'target_id', e.target.value)}
                className="bg-gray-800 text-white px-1 py-1 rounded border border-gray-700 text-xs"
              >
                {neurons.map((n) => (
                  <option key={n.id} value={n.id}>{n.id}</option>
                ))}
              </select>
              <label className="text-xs text-gray-500">w:</label>
              <input
                type="number"
                value={c.weight}
                onChange={(e) => updateConnection(idx, 'weight', e.target.value)}
                className="w-14 bg-gray-800 text-white text-xs px-1 py-1 rounded border border-gray-700"
              />
              <label className="text-xs text-gray-500">d:</label>
              <input
                type="number"
                value={c.delay}
                min={1}
                onChange={(e) => updateConnection(idx, 'delay', e.target.value)}
                className="w-10 bg-gray-800 text-white text-xs px-1 py-1 rounded border border-gray-700"
              />
              <button
                onClick={() => removeConnection(idx)}
                className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-sm text-gray-300">Duration (ms)</label>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          className="w-full accent-indigo-500"
        />
        <div className="text-right text-xs text-indigo-400 font-mono">{duration}</div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? 'Running...' : 'Run Network Simulation'}
      </button>
    </div>
  );
}
