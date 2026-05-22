import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Network, Cpu, HelpCircle } from 'lucide-react';
import DwenKanLogo from './components/DwenKanLogo';
import ControlPanel from './components/ControlPanel';
import VoltageChart from './components/VoltageChart';
import SpikeRaster from './components/SpikeRaster';
import NetworkBuilder from './components/NetworkBuilder';
import NetworkChart from './components/NetworkChart';
import AIControlPanel from './components/AIControlPanel';
import AIVisualization from './components/AIVisualization';
import PresetSelector from './components/PresetSelector';
import ExplanationPanel from './components/ExplanationPanel';
import OnboardingTour, { useOnboarding } from './components/OnboardingTour';
import { simulateNeuron, simulateNetwork, simulateAI } from './api/client';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'Single Neuron', icon: Brain, color: 'indigo' },
  { id: 'Network', icon: Network, color: 'amber' },
  { id: 'AI Mode', icon: Cpu, color: 'emerald' },
];

export default function App() {
  const navigate = useNavigate();
  const tour = useOnboarding();

  const [tab, setTab] = useState('Single Neuron');
  const [result, setResult] = useState(null);
  const [netResult, setNetResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState(null);
  const [mobilePanelView, setMobilePanelView] = useState('controls');

  const handleNeuronRun = async ({ params, I_ext, dt, duration }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateNeuron({ params, I_ext, dt, duration });
      setResult(data);
      setLastParams(params);
      setMobilePanelView('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkRun = async (config) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateNetwork(config);
      setNetResult(data);
      setMobilePanelView('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIRun = async (config) => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulateAI(config);
      setAiResult(data);
      setMobilePanelView('results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPreset = (preset) => {
    if (preset.type === "neuron") {
      setTab('Single Neuron');
      handleNeuronRun(preset.config);
    } else if (preset.type === "network") {
      setTab('Network');
      handleNetworkRun(preset.config);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <OnboardingTour {...tour} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer mr-2"
              title="Back to home"
            >
              <DwenKanLogo size={32} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">
                <span className="text-amber-400">Dwen</span><span className="text-indigo-400">Kan</span>
              </h1>
              <p className="text-[11px] text-gray-500 leading-tight">Neural Simulation Platform</p>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-1 bg-gray-900/80 rounded-xl p-1 border border-gray-800/50" data-tour="tabs">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={"relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer " +
                    (isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300')
                  }
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-violet-600/90 rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.id}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={tour.start}
            className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-400 text-sm transition-colors cursor-pointer"
            title="Restart tour"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tour</span>
          </button>
        </div>
      </header>

      {/* Mobile Controls / Results toggle */}
      <div className="lg:hidden border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-sm px-4 py-2">
        <div className="flex bg-gray-900 rounded-lg p-1 gap-1">
          <button
            onClick={() => setMobilePanelView('controls')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mobilePanelView === 'controls' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Controls
          </button>
          <button
            onClick={() => setMobilePanelView('results')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              mobilePanelView === 'results' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Results
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside className={`space-y-4 ${mobilePanelView === 'results' ? 'hidden lg:block' : ''}`}>
            <div data-tour="presets">
              <PresetSelector onLoadPreset={handleLoadPreset} />
            </div>
            <div data-tour="controls">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === 'Single Neuron' && (
                    <ControlPanel onRun={handleNeuronRun} loading={loading} />
                  )}
                  {tab === 'Network' && (
                    <NetworkBuilder onRun={handleNetworkRun} loading={loading} />
                  )}
                  {tab === 'AI Mode' && (
                    <AIControlPanel onRun={handleAIRun} loading={loading} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>

          {/* Visualization area */}
          <section className={`space-y-5 ${mobilePanelView === 'controls' ? 'hidden lg:block' : ''}`} data-tour="viz-area">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Single Neuron Tab */}
                {tab === 'Single Neuron' && (
                  <>
                    {result ? (
                      <>
                        <VoltageChart
                          time={result.time}
                          voltage={result.voltage}
                          spikes={result.spikes}
                          params={lastParams}
                        />
                        <SpikeRaster spikes={result.spikes} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <StatCard label="Total Spikes" value={result.num_spikes} />
                          <StatCard
                            label="Firing Rate"
                            value={((result.num_spikes / (result.time.length * 0.1)) * 1000).toFixed(1) + ' Hz'}
                          />
                          <StatCard label="Data Points" value={result.time.length.toLocaleString()} />
                        </div>
                        <div data-tour="explain">
                          <ExplanationPanel type="neuron" result={result} params={lastParams} />
                        </div>
                      </>
                    ) : (
                      <EmptyState
                        icon={Brain}
                        title="Single Neuron Simulation"
                        subtitle="Configure LIF parameters and click Run Simulation — or pick a preset from the sidebar."
                      />
                    )}
                  </>
                )}

                {/* Network Tab */}
                {tab === 'Network' && (
                  <>
                    {netResult ? (
                      <>
                        <NetworkChart
                          time={netResult.time}
                          voltages={netResult.voltages}
                          spikes={netResult.spikes}
                          neuronIds={netResult.neuron_ids}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {netResult.neuron_ids.map((nid) => (
                            <StatCard
                              key={nid}
                              label={'Neuron ' + nid}
                              value={(netResult.spikes[nid]?.length ?? 0) + ' spikes'}
                            />
                          ))}
                        </div>
                        <ExplanationPanel type="network" result={netResult} />
                      </>
                    ) : (
                      <EmptyState
                        icon={Network}
                        title="Network Simulation"
                        subtitle="Build a network of neurons with weighted connections and watch activity propagate."
                      />
                    )}
                  </>
                )}

                {/* AI Mode Tab */}
                {tab === 'AI Mode' && (
                  <>
                    {aiResult ? (
                      <>
                        <AIVisualization result={aiResult} />
                        <ExplanationPanel type="ai" result={aiResult} />
                      </>
                    ) : (
                      <EmptyState
                        icon={Cpu}
                        title="AI Forward Pass"
                        subtitle="Configure a PyTorch neural network and compare artificial activations with biological spiking."
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-gray-900/80 border border-gray-800/50 rounded-xl p-4 text-center">
      <div className="text-xl font-bold text-indigo-400">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800/30 border-dashed rounded-2xl p-8 sm:p-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/50 mb-4">
        <Icon className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-400 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto">{subtitle}</p>
    </div>
  );
}
