import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Lightbulb, Zap } from 'lucide-react';

const TOUR_STEPS = [
  {
    target: '[data-tour="tabs"]',
    title: 'Welcome to DwenKan!',
    content: 'This platform lets you simulate biological neurons, build neural networks, and compare them with artificial intelligence models. Let\'s take a quick tour.',
    position: 'bottom',
    icon: '🧠',
  },
  {
    target: '[data-tour="presets"]',
    title: 'Preset Simulations',
    content: 'Start here! Click any preset to instantly load a pre-configured simulation. "Regular Spiking" is a great first experiment.',
    position: 'right',
    icon: '⚡',
  },
  {
    target: '[data-tour="controls"]',
    title: 'Parameter Controls',
    content: 'Adjust neuron parameters with these sliders. Each one maps to a real biophysical property. The explanation panel below will tell you what each parameter does.',
    position: 'right',
    icon: '🎛️',
  },
  {
    target: '[data-tour="run-btn"]',
    title: 'Run the Simulation',
    content: 'Click this button to send your parameters to the backend engine. The simulation runs the LIF equation step-by-step and returns voltage traces and spike events.',
    position: 'top',
    icon: '▶️',
  },
  {
    target: '[data-tour="viz-area"]',
    title: 'Visualization Area',
    content: 'Results appear here — voltage traces show how the membrane potential changes over time, and the spike raster marks when the neuron fires.',
    position: 'left',
    icon: '📊',
  },
  {
    target: '[data-tour="explain"]',
    title: 'Live Explanations',
    content: 'This panel explains what\'s happening in plain language after each simulation. It analyzes your results and tells you exactly what the neuron is doing and why.',
    position: 'left',
    icon: '💡',
  },
];

const STORAGE_KEY = 'dwenkan-tour-completed';

export function useOnboarding() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const next = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  const prev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  return { active, step, start, finish, next, prev, totalSteps: TOUR_STEPS.length };
}

export default function OnboardingTour({ active, step, next, prev, finish, totalSteps }) {
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState(null);
  const currentStep = TOUR_STEPS[step];

  useEffect(() => {
    if (!active || !currentStep) return;

    const el = document.querySelector(currentStep.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const timer = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        setHighlightRect({
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        });

        const pos = { top: 0, left: 0 };
        const tooltipW = 360;
        const tooltipH = 200;

        switch (currentStep.position) {
          case 'bottom':
            pos.top = rect.bottom + 16;
            pos.left = rect.left + rect.width / 2 - tooltipW / 2;
            break;
          case 'top':
            pos.top = rect.top - tooltipH - 16;
            pos.left = rect.left + rect.width / 2 - tooltipW / 2;
            break;
          case 'right':
            pos.top = rect.top;
            pos.left = rect.right + 16;
            break;
          case 'left':
            pos.top = rect.top;
            pos.left = rect.left - tooltipW - 16;
            break;
        }

        // Clamp to viewport
        pos.left = Math.max(16, Math.min(pos.left, window.innerWidth - tooltipW - 16));
        pos.top = Math.max(16, Math.min(pos.top, window.innerHeight - tooltipH - 16));

        setTooltipPos(pos);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [active, step, currentStep]);

  if (!active || !currentStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998]"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={finish}
      />

      {/* Highlight cutout */}
      {highlightRect && (
        <motion.div
          key="highlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-[9999] rounded-xl border-2 border-indigo-400 pointer-events-none"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55), 0 0 20px rgba(99,102,241,0.3)',
          }}
        />
      )}

      {/* Tooltip */}
      <motion.div
        key={`tooltip-${step}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="fixed z-[10000] w-[360px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/40 p-5"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={finish}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{currentStep.icon}</span>
          <div>
            <h3 className="text-white font-semibold text-base">{currentStep.title}</h3>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          {currentStep.content}
        </p>

        {/* Progress & nav */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-indigo-400' : i < step ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            >
              {step === totalSteps - 1 ? 'Get Started' : 'Next'}
              {step < totalSteps - 1 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
