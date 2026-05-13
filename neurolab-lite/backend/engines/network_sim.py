"""
Multi-neuron network simulation engine.

This extends the single LIF neuron to a network of interconnected neurons.
Each neuron follows the same LIF dynamics, but now receives additional
synaptic input from other neurons that have recently spiked.

Synaptic transmission model (simplified):
- When neuron A spikes at time t, neuron B receives an instantaneous current
  pulse of magnitude `weight` at time t + delay.
- This is a simple "current-based" synapse model (as opposed to
  conductance-based models used in more detailed simulations).

The network can exhibit emergent behaviors:
- Feedforward chains: activity propagates through layers
- Recurrent excitation: positive feedback loops
- Inhibitory control: negative weights suppress activity
"""

import numpy as np
from collections import defaultdict

from models.neuron import NeuronParams
from models.network import NetworkNeuron, Connection


def simulate_network(
    neurons: list[NetworkNeuron],
    connections: list[Connection],
    external_currents: dict[str, float],
    dt: float,
    duration: float,
) -> dict:
    """
    Run a step-based simulation of a network of LIF neurons.

    Args:
        neurons: List of neurons with their parameters.
        connections: List of synaptic connections.
        external_currents: External current per neuron ID.
        dt: Time step (ms).
        duration: Total simulation duration (ms).

    Returns:
        Dictionary with 'time', 'voltages', 'spikes', 'neuron_ids'.
    """
    num_steps = int(duration / dt)
    time = (np.arange(num_steps) * dt).tolist()

    # Build lookup structures
    neuron_map = {n.id: n.params for n in neurons}
    neuron_ids = [n.id for n in neurons]

    # Pre-compute incoming connections per target neuron
    # incoming[target_id] = [(source_id, weight, delay), ...]
    incoming = defaultdict(list)
    for conn in connections:
        if conn.source_id in neuron_map and conn.target_id in neuron_map:
            incoming[conn.target_id].append((conn.source_id, conn.weight, conn.delay))

    # State arrays
    voltages = {nid: np.zeros(num_steps) for nid in neuron_ids}
    spike_times = {nid: [] for nid in neuron_ids}
    # Track spike events as boolean array for efficient lookup
    spiked = {nid: np.zeros(num_steps, dtype=bool) for nid in neuron_ids}

    # Initialize to resting potential
    for nid in neuron_ids:
        voltages[nid][0] = neuron_map[nid].V_rest

    # Main simulation loop
    for t in range(num_steps - 1):
        for nid in neuron_ids:
            params = neuron_map[nid]

            # External current for this neuron
            I_ext = external_currents.get(nid, 0.0)

            # Synaptic current: sum contributions from pre-synaptic spikes
            # that arrived after accounting for delay
            I_syn = 0.0
            for src_id, weight, delay in incoming[nid]:
                # Check if source neuron spiked at time (t - delay)
                t_pre = t - delay
                if t_pre >= 0 and spiked[src_id][t_pre]:
                    I_syn += weight

            I_total = I_ext + I_syn

            # LIF voltage update: dV/dt = -(V - V_rest)/tau + R * I
            dV = (dt / params.tau) * (
                -(voltages[nid][t] - params.V_rest) + params.R * I_total
            )
            voltages[nid][t + 1] = voltages[nid][t] + dV

            # Threshold crossing → spike
            if voltages[nid][t + 1] >= params.V_threshold:
                spike_times[nid].append(time[t + 1])
                spiked[nid][t + 1] = True
                voltages[nid][t + 1] = params.V_reset

    return {
        "time": time,
        "voltages": {nid: voltages[nid].tolist() for nid in neuron_ids},
        "spikes": spike_times,
        "neuron_ids": neuron_ids,
    }
