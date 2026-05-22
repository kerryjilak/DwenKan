import { useState } from 'react';

export default function AIControlPanel({ onRun, loading }) {
  const [config, setConfig] = useState({
    input_size: 2,
    hidden_sizes: [4, 4],
    output_size: 1,
    activation: 'relu',
  });
  const [inputText, setInputText] = useState('1.0, 0.5');

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateHiddenLayer = (idx, value) => {
    const sizes = [...config.hidden_sizes];
    sizes[idx] = parseInt(value) || 1;
    setConfig((prev) => ({ ...prev, hidden_sizes: sizes }));
  };

  const addHiddenLayer = () => {
    if (config.hidden_sizes.length < 5) {
      setConfig((prev) => ({
        ...prev,
        hidden_sizes: [...prev.hidden_sizes, 4],
      }));
    }
  };

  const removeHiddenLayer = (idx) => {
    if (config.hidden_sizes.length > 1) {
      setConfig((prev) => ({
        ...prev,
        hidden_sizes: prev.hidden_sizes.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleSubmit = () => {
    const input_data = [inputText.split(',').map((s) => parseFloat(s.trim()))];
    onRun({ config, input_data });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-white">AI Network Config</h2>

      <div>
        <label className="text-sm text-gray-300">Input Size</label>
        <input
          type="number"
          min={1}
          max={20}
          value={config.input_size}
          onChange={(e) => updateConfig('input_size', parseInt(e.target.value) || 1)}
          className="w-full mt-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">Hidden Layers</label>
          <button
            onClick={addHiddenLayer}
            disabled={config.hidden_sizes.length >= 5}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 px-2 py-1 rounded text-white cursor-pointer"
          >
            + Add Layer
          </button>
        </div>
        {config.hidden_sizes.map((size, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 w-16">Layer {idx + 1}</span>
            <input
              type="number"
              min={1}
              max={64}
              value={size}
              onChange={(e) => updateHiddenLayer(idx, e.target.value)}
              className="flex-1 bg-gray-800 text-white px-2 py-1 rounded border border-gray-700 text-sm"
            />
            <span className="text-xs text-gray-500">neurons</span>
            {config.hidden_sizes.length > 1 && (
              <button
                onClick={() => removeHiddenLayer(idx)}
                className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="text-sm text-gray-300">Output Size</label>
        <input
          type="number"
          min={1}
          max={20}
          value={config.output_size}
          onChange={(e) => updateConfig('output_size', parseInt(e.target.value) || 1)}
          className="w-full mt-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
        />
      </div>

      <div>
        <label className="text-sm text-gray-300">Activation Function</label>
        <select
          value={config.activation}
          onChange={(e) => updateConfig('activation', e.target.value)}
          className="w-full mt-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700"
        >
          <option value="relu">ReLU — max(0, x)</option>
          <option value="sigmoid">Sigmoid — 1/(1+e⁻ˣ)</option>
          <option value="tanh">Tanh — centered sigmoid</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-300">Input Values (comma-separated)</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full mt-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 font-mono text-sm"
          placeholder="1.0, 0.5"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? 'Running...' : 'Run AI Forward Pass'}
      </button>

      <div className="text-xs text-gray-500 border-t border-gray-800 pt-3 space-y-1">
        <p className="font-semibold text-gray-400">Bio vs AI Comparison:</p>
        <p>• Biological: spikes over time (temporal coding)</p>
        <p>• Artificial: instant layer-by-layer activation values</p>
        <p>• Bio neurons have memory (voltage state); AI neurons are stateless</p>
      </div>
    </div>
  );
}
