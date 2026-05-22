/**
 * Preset simulation configurations (embedded from backend/presets/).
 */

export const PRESETS = [
  {
    name: "Regular Spiking",
    description: "Standard LIF neuron with moderate input — regular spike train",
    type: "neuron",
    filename: "regular_spiking",
    config: {
      params: { V_rest: -70, V_threshold: -55, V_reset: -75, tau: 10, R: 1 },
      I_ext: 20,
      dt: 0.1,
      duration: 100,
    },
  },
  {
    name: "Fast Spiking",
    description: "Low time constant, high current — fast firing interneuron",
    type: "neuron",
    filename: "fast_spiking",
    config: {
      params: { V_rest: -70, V_threshold: -55, V_reset: -75, tau: 5, R: 1 },
      I_ext: 30,
      dt: 0.1,
      duration: 100,
    },
  },
  {
    name: "Subthreshold",
    description: "Low input current — voltage oscillates but never spikes",
    type: "neuron",
    filename: "subthreshold",
    config: {
      params: { V_rest: -70, V_threshold: -55, V_reset: -75, tau: 10, R: 1 },
      I_ext: 10,
      dt: 0.1,
      duration: 200,
    },
  },
  {
    name: "Excitation-Inhibition",
    description: "Two excitatory neurons and one inhibitory neuron",
    type: "network",
    filename: "excitation_inhibition",
    config: {
      neurons: [{ id: "E1" }, { id: "E2" }, { id: "I" }],
      connections: [
        { source_id: "E1", target_id: "E2", weight: 15, delay: 1 },
        { source_id: "E1", target_id: "I", weight: 15, delay: 1 },
        { source_id: "I", target_id: "E2", weight: -20, delay: 1 },
      ],
      external_currents: { E1: 22, E2: 12 },
      dt: 0.1,
      duration: 200,
    },
  },
  {
    name: "Feedforward Chain",
    description: "3-neuron chain — activity propagates from A to B to C",
    type: "network",
    filename: "feedforward_chain",
    config: {
      neurons: [{ id: "A" }, { id: "B" }, { id: "C" }],
      connections: [
        { source_id: "A", target_id: "B", weight: 20, delay: 2 },
        { source_id: "B", target_id: "C", weight: 20, delay: 2 },
      ],
      external_currents: { A: 25 },
      dt: 0.1,
      duration: 150,
    },
  },
];

export function getPresetList() {
  return PRESETS.map(({ name, description, type, filename }) => ({
    name,
    description,
    type,
    filename,
  }));
}

export function getPreset(filename) {
  return PRESETS.find((p) => p.filename === filename) || null;
}
