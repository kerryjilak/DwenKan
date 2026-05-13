import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Network,
  Cpu,
  ChevronRight,
  FlaskConical,
  BarChart3,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import DwenKanLogo from './DwenKanLogo';

const FEATURES = [
  {
    icon: Brain,
    title: 'Biological Neurons',
    desc: 'Simulate Leaky Integrate-and-Fire neurons with real biophysical parameters — membrane potential, time constants, and spike thresholds.',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: Network,
    title: 'Neural Networks',
    desc: 'Build small networks of interconnected neurons with weighted synapses and propagation delays. Watch activity cascade through layers.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Cpu,
    title: 'AI Comparison',
    desc: 'Run PyTorch feedforward networks side-by-side with biological models. See how artificial activation functions approximate real neural firing.',
    color: 'from-emerald-500 to-teal-600',
  },
];

const HERO_STATS = [
  { value: 'LIF', label: 'Neuron Model' },
  { value: '10+', label: 'Parameters' },
  { value: '3', label: 'Simulation Modes' },
  { value: '∞', label: 'Experiments' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Nav */}
      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DwenKanLogo size={32} />
            <span className="text-xl font-bold">
              <span className="text-amber-400">Dwen</span><span className="text-indigo-400">Kan</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 cursor-pointer"
          >
            Launch Simulator
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <FlaskConical className="w-4 h-4" />
            Educational Neuroengineering Platform
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="block">Simulate the</span>
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Brain&apos;s Language
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore how biological neurons compute — from single cells to networks.
            Then compare them with artificial neural networks, all in your browser.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer"
            >
              Start Experimenting
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-300 hover:text-white px-6 py-3.5 rounded-xl text-base font-medium transition-all cursor-pointer"
            >
              How It Works
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {HERO_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Animated neuron visualization */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-8 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />

          {/* Fake voltage trace preview */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-gray-500 font-mono">dwenkan — LIF Simulation</span>
            </div>
            <svg viewBox="0 0 800 200" className="w-full h-40 sm:h-52" preserveAspectRatio="none">
              <defs>
                <linearGradient id="voltageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Threshold line */}
              <line x1="0" y1="60" x2="800" y2="60" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              <text x="10" y="55" fill="#ef4444" fontSize="10" opacity="0.6">threshold</text>
              {/* Animated voltage trace */}
              <motion.path
                d="M0,140 L50,135 L100,125 L120,100 L130,70 L132,30 L134,170 L150,145 L200,140 L250,130 L270,105 L280,70 L282,30 L284,170 L300,145 L350,138 L400,128 L420,100 L430,70 L432,30 L434,170 L460,145 L510,140 L560,130 L580,100 L590,70 L592,30 L594,170 L620,145 L670,140 L720,130 L740,102 L750,70 L752,30 L754,170 L780,145 L800,140"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: 'easeInOut', delay: 0.8 }}
              />
              <motion.path
                d="M0,140 L50,135 L100,125 L120,100 L130,70 L132,30 L134,170 L150,145 L200,140 L250,130 L270,105 L280,70 L282,30 L284,170 L300,145 L350,138 L400,128 L420,100 L430,70 L432,30 L434,170 L460,145 L510,140 L560,130 L580,100 L590,70 L592,30 L594,170 L620,145 L670,140 L720,130 L740,102 L750,70 L752,30 L754,170 L780,145 L800,200 L0,200 Z"
                fill="url(#voltageGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </svg>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
              <span>0 ms</span>
              <span className="text-indigo-400">Membrane Voltage over Time</span>
              <span>100 ms</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three Modes of Exploration</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From single neuron dynamics to full AI comparison — each mode builds on the last.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="relative group bg-gray-900/80 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              <AnimatePresence>
                {hoveredFeature === idx && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.07 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} pointer-events-none`}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Science section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-8 sm:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                The Science
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">The LIF Equation</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                The Leaky Integrate-and-Fire model captures the essential behavior of biological neurons
                using a single differential equation. It&apos;s the most widely used model in computational neuroscience.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Try it yourself
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-950 rounded-xl p-6 border border-gray-800">
              <div className="text-xs text-gray-500 mb-3 font-mono">LIF Dynamics</div>
              <div className="font-mono text-lg text-center py-6 space-y-4">
                <div>
                  <span className="text-gray-400">τ</span>
                  <span className="text-gray-600"> · </span>
                  <span className="text-indigo-400">dV/dt</span>
                  <span className="text-gray-600"> = </span>
                  <span className="text-gray-400">−(V − V</span>
                  <sub className="text-gray-500">rest</sub>
                  <span className="text-gray-400">)</span>
                  <span className="text-gray-600"> + </span>
                  <span className="text-amber-400">R · I</span>
                </div>
                <div className="text-sm text-gray-500 border-t border-gray-800 pt-4">
                  <span className="text-red-400">if V ≥ V<sub>thresh</sub></span>
                  <span className="text-gray-600"> → </span>
                  <span className="text-emerald-400">spike!</span>
                  <span className="text-gray-600"> → </span>
                  <span className="text-gray-400">V = V<sub>reset</sub></span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                <div className="bg-gray-900 rounded px-2 py-1.5">
                  <span className="text-gray-500">τ</span> = membrane time constant
                </div>
                <div className="bg-gray-900 rounded px-2 py-1.5">
                  <span className="text-gray-500">V</span> = membrane voltage
                </div>
                <div className="bg-gray-900 rounded px-2 py-1.5">
                  <span className="text-gray-500">R</span> = membrane resistance
                </div>
                <div className="bg-gray-900 rounded px-2 py-1.5">
                  <span className="text-gray-500">I</span> = input current
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-gray-400 text-lg mb-8">
            No signup required. Start simulating neurons in seconds.
          </p>
          <button
            onClick={() => navigate('/app')}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-xl hover:shadow-indigo-500/20 cursor-pointer"
          >
            Launch DwenKan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <DwenKanLogo size={16} />
            <span>DwenKan — Educational Neuroengineering Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Built with FastAPI + React + PyTorch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
