"""
Leaky Integrate-and-Fire (LIF) Neuron Engine.

The LIF model is the workhorse of computational neuroscience. It models the
neuron's membrane as an RC circuit:

    tau * dV/dt = -(V - V_rest) + R * I_ext

Where:
    V       = membrane voltage (mV)
    V_rest  = resting potential (mV)
    tau     = membrane time constant (ms) = R_m * C_m
    R       = membrane resistance (MΩ)
    I_ext   = external input current (nA)

Discretized using forward Euler method:
    V[t+1] = V[t] + (dt / tau) * (-(V[t] - V_rest) + R * I_ext)

When V >= V_threshold:
    - A spike is recorded at time t
    - V is reset to V_reset

This captures the essential dynamics: subthreshold integration, threshold
crossing, and spike generation with reset.
"""

import numpy as np

from models.neuron import NeuronParams


def simulate_lif_neuron(
    params: NeuronParams,
    I_ext: float,
    dt: float,
    duration: float,
) -> dict:
    """
    Run a step-based LIF neuron simulation.

    Args:
        params: Neuron biophysical parameters.
        I_ext: Constant external current (nA). In a more complex model, this
               could be a time-varying array.
        dt: Integration time step (ms). Smaller dt = more accurate but slower.
        duration: Total simulation length (ms).

    Returns:
        Dictionary with 'time', 'voltage', 'spikes', 'num_spikes'.
    """
    # Number of discrete time steps
    num_steps = int(duration / dt)

    # Pre-allocate arrays for efficiency (NumPy vectorization where possible)
    time = np.arange(0, num_steps) * dt
    voltage = np.zeros(num_steps)
    spike_times: list[float] = []

    # Initial condition: neuron starts at resting potential
    voltage[0] = params.V_rest

    # Main simulation loop — this is the core of the LIF model
    for t in range(num_steps - 1):
        # Forward Euler integration of the LIF equation:
        #   dV/dt = -(V - V_rest) / tau + R * I_ext / tau
        #
        # Biologically: the -(V - V_rest)/tau term represents the "leak" —
        # ion channels that pull the voltage back toward rest.
        # The R * I_ext term represents the effect of injected current.
        dV = (dt / params.tau) * (-(voltage[t] - params.V_rest) + params.R * I_ext)
        voltage[t + 1] = voltage[t] + dV

        # Threshold check: has the neuron reached firing threshold?
        if voltage[t + 1] >= params.V_threshold:
            # Record the spike time
            spike_times.append(float(time[t + 1]))

            # Reset the membrane potential (models the after-hyperpolarization)
            # In real neurons, voltage-gated K+ channels open and bring
            # the potential below rest briefly.
            voltage[t + 1] = params.V_reset

    return {
        "time": time.tolist(),
        "voltage": voltage.tolist(),
        "spikes": spike_times,
        "num_spikes": len(spike_times),
    }
