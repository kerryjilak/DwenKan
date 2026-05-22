/**
 * Leaky Integrate-and-Fire (LIF) Neuron Engine (client-side).
 *
 * Forward Euler integration of:
 *   tau * dV/dt = -(V - V_rest) + R * I_ext
 */

export function simulateLIFNeuron({ params, I_ext, dt, duration }) {
  const {
    V_rest = -70,
    V_threshold = -55,
    V_reset = -75,
    tau = 10,
    R = 1,
  } = params;

  const numSteps = Math.floor(duration / dt);
  const time = new Array(numSteps);
  const voltage = new Array(numSteps);
  const spikes = [];

  for (let i = 0; i < numSteps; i++) {
    time[i] = i * dt;
  }

  voltage[0] = V_rest;

  for (let t = 0; t < numSteps - 1; t++) {
    const dV = (dt / tau) * (-(voltage[t] - V_rest) + R * I_ext);
    voltage[t + 1] = voltage[t] + dV;

    if (voltage[t + 1] >= V_threshold) {
      spikes.push(time[t + 1]);
      voltage[t + 1] = V_reset;
    }
  }

  return { time, voltage, spikes, num_spikes: spikes.length };
}
