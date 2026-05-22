"""
Router for network simulation endpoints.
"""

from fastapi import APIRouter

from models.network import NetworkSimulationRequest, NetworkSimulationResponse
from engines.network_sim import simulate_network

router = APIRouter(tags=["network"])


@router.post("/simulate-network", response_model=NetworkSimulationResponse)
def run_network_simulation(request: NetworkSimulationRequest) -> NetworkSimulationResponse:
    """
    Simulate a network of interconnected LIF neurons.

    Neurons are connected by weighted synaptic connections. When a neuron fires,
    it sends current to its post-synaptic targets after a propagation delay.
    """
    result = simulate_network(
        neurons=request.neurons,
        connections=request.connections,
        external_currents=request.external_currents,
        dt=request.dt,
        duration=request.duration,
    )
    return NetworkSimulationResponse(**result)
