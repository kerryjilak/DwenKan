import { getPresetList, getPreset } from '../data/presets';

export default function PresetSelector({ onLoadPreset }) {
  const presets = getPresetList();

  const handleSelect = (filename) => {
    const data = getPreset(filename);
    if (data) onLoadPreset(data);
  };

  if (presets.length === 0) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Preset Simulations</h3>
      <div className="space-y-2">
        {presets.map((p) => (
          <button
            key={p.filename}
            onClick={() => handleSelect(p.filename)}
            className="w-full text-left bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-500 rounded-lg px-3 py-2 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                p.type === 'neuron' ? 'bg-indigo-900 text-indigo-300' : 'bg-amber-900 text-amber-300'
              }`}>
                {p.type}
              </span>
              <span className="text-sm text-white font-medium">{p.name}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
