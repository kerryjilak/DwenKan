import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Activity, AlertTriangle, Zap, Brain } from 'lucide-react';

function analyzeNeuronResult(result, params) {
  if (!result) return null;

  const { voltage, spikes, time, num_spikes } = result;
  const duration = time[time.length - 1];
  const firingRate = (num_spikes / duration) * 1000; // Hz
  const vMin = Math.min(...voltage);
  const vMax = Math.max(...voltage);

  const insights = [];
  const details = [];

  // Spiking behavior
  if (num_spikes === 0) {
    insights.push({
      icon: AlertTriangle,
      color: 'text-amber-400',
      title: 'Subthreshold Activity',
      text: `The neuron never reached the firing threshold (${params?.V_threshold ?? -55} mV). The input current isn't strong enough to overcome the membrane leak. This is like a neuron receiving weak synaptic input — it depolarizes but never fires.`,
    });
    details.push(`Peak voltage reached: ${vMax.toFixed(1)} mV (threshold: ${params?.V_threshold ?? -55} mV)`);
    details.push('Try increasing Input Current or decreasing the Time Constant τ to see spikes.');
  } else if (firingRate < 20) {
    insights.push({
      icon: Activity,
      color: 'text-emerald-400',
      title: 'Low-Frequency Firing',
      text: `The neuron is firing at ${firingRate.toFixed(1)} Hz — a slow, regular rhythm. This is typical of pyramidal neurons in cortex at rest. Each spike is followed by a reset period where the membrane recovers before firing again.`,
    });
  } else if (firingRate < 60) {
    insights.push({
      icon: TrendingUp,
      color: 'text-indigo-400',
      title: 'Moderate Firing Rate',
      text: `Firing at ${firingRate.toFixed(1)} Hz — this neuron is actively encoding information. In real brains, moderate firing rates carry the most information per spike (energy-efficient coding).`,
    });
  } else {
    insights.push({
      icon: Zap,
      color: 'text-red-400',
      title: 'High-Frequency Bursting',
      text: `Firing at ${firingRate.toFixed(1)} Hz — very fast! This resembles fast-spiking interneurons (basket cells) that use GABAergic inhibition. Real neurons rarely sustain rates above 100 Hz due to refractory periods.`,
    });
  }

  // Inter-spike interval analysis
  if (spikes.length >= 2) {
    const isis = [];
    for (let i = 1; i < spikes.length; i++) {
      isis.push(spikes[i] - spikes[i - 1]);
    }
    const meanISI = isis.reduce((a, b) => a + b, 0) / isis.length;
    const isiVariance = isis.reduce((a, b) => a + (b - meanISI) ** 2, 0) / isis.length;
    const cv = Math.sqrt(isiVariance) / meanISI;

    if (cv < 0.1) {
      insights.push({
        icon: Brain,
        color: 'text-violet-400',
        title: 'Clock-Like Regularity',
        text: `The inter-spike intervals are extremely regular (CV = ${cv.toFixed(3)}). With constant input, the LIF model produces perfectly periodic spikes — each cycle takes ${meanISI.toFixed(1)} ms. Real neurons add noise, making the pattern less perfect.`,
      });
    }
    details.push(`Average inter-spike interval: ${meanISI.toFixed(1)} ms`);
  }

  // Parameter insights
  if (params) {
    if (params.tau > 20) {
      insights.push({
        icon: TrendingDown,
        color: 'text-cyan-400',
        title: 'High Time Constant',
        text: `With τ = ${params.tau} ms, this neuron has a long memory — it integrates inputs over a wide time window. This is characteristic of cortical neurons that need to combine information arriving at different times.`,
      });
    } else if (params.tau < 5) {
      insights.push({
        icon: Zap,
        color: 'text-orange-400',
        title: 'Fast Membrane Dynamics',
        text: `With τ = ${params.tau} ms, the membrane voltage decays very quickly. The neuron is a "coincidence detector" — it only fires when many inputs arrive simultaneously. Typical of auditory brainstem neurons.`,
      });
    }
  }

  return { insights, details, firingRate, num_spikes, duration };
}

function analyzeNetworkResult(result) {
  if (!result) return null;

  const { neuron_ids, spikes, time } = result;
  const duration = time[time.length - 1];
  const insights = [];
  const details = [];

  const totalSpikes = neuron_ids.reduce((sum, nid) => sum + (spikes[nid]?.length ?? 0), 0);
  const activeNeurons = neuron_ids.filter((nid) => spikes[nid]?.length > 0);

  if (activeNeurons.length === 0) {
    insights.push({
      icon: AlertTriangle,
      color: 'text-amber-400',
      title: 'Silent Network',
      text: 'No neurons fired. The external currents may be too weak, or inhibitory connections might be suppressing all activity. Try increasing input currents or adding stronger excitatory weights.',
    });
  } else if (activeNeurons.length < neuron_ids.length) {
    const silent = neuron_ids.filter((nid) => !spikes[nid]?.length);
    insights.push({
      icon: Activity,
      color: 'text-indigo-400',
      title: 'Partial Activation',
      text: `${activeNeurons.length} of ${neuron_ids.length} neurons fired. Neurons ${silent.join(', ')} remained silent — their synaptic input wasn't strong enough to reach threshold. This is called "sparse coding" and is actually how real cortical networks work.`,
    });
  } else {
    insights.push({
      icon: Zap,
      color: 'text-emerald-400',
      title: 'Full Network Activation',
      text: `All ${neuron_ids.length} neurons fired at least once. Activity successfully propagated through the network. In the brain, this kind of reliable transmission is essential for sensory processing.`,
    });
  }

  // Check for propagation
  if (activeNeurons.length >= 2) {
    const firstSpikes = {};
    activeNeurons.forEach((nid) => {
      if (spikes[nid]?.length > 0) firstSpikes[nid] = spikes[nid][0];
    });
    const sorted = Object.entries(firstSpikes).sort((a, b) => a[1] - b[1]);
    if (sorted.length >= 2) {
      const delay = sorted[sorted.length - 1][1] - sorted[0][1];
      insights.push({
        icon: TrendingUp,
        color: 'text-violet-400',
        title: 'Signal Propagation',
        text: `Activity traveled from Neuron ${sorted[0][0]} (first spike at ${sorted[0][1].toFixed(1)} ms) to Neuron ${sorted[sorted.length - 1][0]} (first spike at ${sorted[sorted.length - 1][1].toFixed(1)} ms) — a propagation delay of ${delay.toFixed(1)} ms. This models axonal conduction + synaptic delay.`,
      });
    }
  }

  details.push(`Total spikes: ${totalSpikes} across ${activeNeurons.length} active neurons`);
  details.push(`Simulation duration: ${duration} ms`);

  return { insights, details };
}

function analyzeAIResult(result) {
  if (!result) return null;

  const insights = [];
  const details = [];

  insights.push({
    icon: Brain,
    color: 'text-purple-400',
    title: 'Instantaneous Computation',
    text: 'Unlike biological neurons that evolve over time, this artificial network computed its output in a single forward pass — no temporal dynamics, no spikes. Each layer transforms the input through a learned weight matrix plus activation function.',
  });

  // Check for dead ReLU neurons
  const hiddenLayers = result.layer_activations.filter(
    (la) => la.layer_name !== 'Input' && la.layer_name !== 'Output'
  );
  for (const la of hiddenLayers) {
    const flatValues = la.values.flat();
    const zeroCount = flatValues.filter((v) => v === 0).length;
    if (zeroCount > flatValues.length * 0.5) {
      insights.push({
        icon: AlertTriangle,
        color: 'text-amber-400',
        title: `Dead Neurons in ${la.layer_name}`,
        text: `${zeroCount} of ${flatValues.length} activations are zero. With ReLU, any negative pre-activation gets killed to zero — these are "dead neurons." In trained networks, excessive dead neurons indicate poor initialization or vanishing gradients.`,
      });
    }
  }

  insights.push({
    icon: Activity,
    color: 'text-cyan-400',
    title: 'Bio vs AI: Key Difference',
    text: 'Biological neurons communicate via spikes (binary, temporal events). Artificial neurons pass continuous floating-point values. The brain\'s spiking code is more energy-efficient but harder to train — that\'s why we use backpropagation for ANNs instead of biological learning rules.',
  });

  details.push(`Architecture: ${result.architecture.join(' → ')}`);
  details.push(`Output values: ${result.output[0].map((v) => v.toFixed(4)).join(', ')}`);

  return { insights, details };
}

export default function ExplanationPanel({ type, result, params }) {
  const analysis = useMemo(() => {
    switch (type) {
      case 'neuron':
        return analyzeNeuronResult(result, params);
      case 'network':
        return analyzeNetworkResult(result);
      case 'ai':
        return analyzeAIResult(result);
      default:
        return null;
    }
  }, [type, result, params]);

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
      data-tour="explain"
    >
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border-b border-gray-800 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">What&apos;s Happening</h3>
      </div>

      <div className="p-5 space-y-4">
        {analysis.insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.25 }}
            className="flex gap-3"
          >
            <div className={`mt-0.5 ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{insight.text}</p>
            </div>
          </motion.div>
        ))}

        {analysis.details.length > 0 && (
          <div className="border-t border-gray-800 pt-3 mt-3">
            <div className="flex flex-wrap gap-2">
              {analysis.details.map((d, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
