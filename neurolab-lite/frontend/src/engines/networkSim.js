/**
 * Multi-neuron LIF network simulation engine (client-side).
 *
 * Each neuron follows LIF dynamics and receives synaptic current from
 * pre-synaptic spikes (current-based synapse model with delay).
 */

export function simulateNetwork({ neurons, connections, external_currents = {}, dt, duration }) {
  const numSteps = Math.floor(duration / dt);
  const time = new Array(numSteps);
  for (let i = 0; i < numSteps; i++) {
    time[i] = i * dt;
  }

  const neuronIds = neurons.map((n) => n.id);
  const neuronMap = {};
  for (const n of neurons) {
    neuronMap[n.id] = n.params || {
      V_rest: -70,
      V_threshold: -55,
      V_reset: -75,
      tau: 10,
      R: 1,
    };
  }

  // Build incoming connection lookup per target neuron
  const incoming = {};
  for (const nid of neuronIds) incoming[nid] = [];
  for (const conn of connections) {
    if (neuronMap[conn.source_id] && neuronMap[conn.target_id]) {
      incoming[conn.target_id].push({
        sourceId: conn.source_id,
        weight: conn.weight,
        delay: conn.delay,
      });
    }
  }

  // Allocate state
  const voltages = {};
  const spiked = {};
  const spikeTimes = {};
  for (const nid of neuronIds) {
    voltages[nid] = new Float64Array(numSteps);
    spiked[nid] = new Uint8Array(numSteps);
    spikeTimes[nid] = [];
    voltages[nid][0] = neuronMap[nid].V_rest ?? -70;
  }

  // Simulation loop
  for (let t = 0; t < numSteps - 1; t++) {
    for (const nid of neuronIds) {
      const p = neuronMap[nid];
      const V_rest = p.V_rest ?? -70;
      const V_threshold = p.V_threshold ?? -55;
      const V_reset = p.V_reset ?? -75;
      const tau = p.tau ?? 10;
      const R = p.R ?? 1;

      const I_ext = external_currents[nid] || 0;

      let I_syn = 0;
      for (const { sourceId, weight, delay } of incoming[nid]) {
        const tPre = t - delay;
        if (tPre >= 0 && spiked[sourceId][tPre]) {
          I_syn += weight;
        }
      }

      const I_total = I_ext + I_syn;
      const dV = (dt / tau) * (-(voltages[nid][t] - V_rest) + R * I_total);
      voltages[nid][t + 1] = voltages[nid][t] + dV;

      if (voltages[nid][t + 1] >= V_threshold) {
        spikeTimes[nid].push(time[t + 1]);
        spiked[nid][t + 1] = 1;
        voltages[nid][t + 1] = V_reset;
      }
    }
  }

  // Convert typed arrays to regular arrays for JSON compatibility
  const voltageArrays = {};
  for (const nid of neuronIds) {
    voltageArrays[nid] = Array.from(voltages[nid]);
  }

  return {
    time: Array.from(time),
    voltages: voltageArrays,
    spikes: spikeTimes,
    neuron_ids: neuronIds,
  };
}
