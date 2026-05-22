import { useState } from 'react';

const defaultParams = {
  V_rest: -70,
  V_threshold: -55,
  V_reset: -75,
  tau: 10,
  R: 1,
};

const defaultSim = {
  I_ext: 20,
  dt: 0.1,
  duration: 100,
};

export default function ControlPanel({ onRun, loading }) {
  const [params, setParams] = useState(defaultParams);
  const [sim, setSim] = useState(defaultSim);

  const handleParamChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  const handleSimChange = (key, value) => {
    setSim((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  const handleSubmit = () => {
    onRun({ params, ...sim });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-bold text-white">Neuron Parameters</h2>

      <div className="space-y-4">
        <SliderInput
          label="Resting Potential (mV)"
          value={params.V_rest}
          min={-90}
          max={-50}
          step={1}
          onChange={(v) => handleParamChange('V_rest', v)}
        />
        <SliderInput
          label="Threshold (mV)"
          value={params.V_threshold}
          min={-70}
          max={-30}
          step={1}
          onChange={(v) => handleParamChange('V_threshold', v)}
        />
        <SliderInput
          label="Reset Potential (mV)"
          value={params.V_reset}
          min={-90}
          max={-50}
          step={1}
          onChange={(v) => handleParamChange('V_reset', v)}
        />
        <SliderInput
          label="Time Constant τ (ms)"
          value={params.tau}
          min={1}
          max={50}
          step={0.5}
          onChange={(v) => handleParamChange('tau', v)}
        />
        <SliderInput
          label="Membrane Resistance R (MΩ)"
          value={params.R}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(v) => handleParamChange('R', v)}
        />
      </div>

      <h2 className="text-lg font-bold text-white">Simulation Settings</h2>

      <div className="space-y-4">
        <SliderInput
          label="Input Current (nA)"
          value={sim.I_ext}
          min={0}
          max={50}
          step={0.5}
          onChange={(v) => handleSimChange('I_ext', v)}
        />
        <SliderInput
          label="Duration (ms)"
          value={sim.duration}
          min={10}
          max={500}
          step={10}
          onChange={(v) => handleSimChange('duration', v)}
        />
        <SliderInput
          label="Time Step dt (ms)"
          value={sim.dt}
          min={0.01}
          max={1}
          step={0.01}
          onChange={(v) => handleSimChange('dt', v)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
      >
        {loading ? 'Running...' : 'Run Simulation'}
      </button>
    </div>
  );
}

function SliderInput({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-gray-300 mb-1">
        <span>{label}</span>
        <span className="font-mono text-indigo-400">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full accent-indigo-500"
      />
    </div>
  );
}
