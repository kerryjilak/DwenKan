"""
Router for single neuron simulation endpoints.
"""

from fastapi import APIRouter

from models.neuron import NeuronSimulationRequest, NeuronSimulationResponse
from engines.lif_neuron import simulate_lif_neuron

router = APIRouter(tags=["neuron"])


@router.post("/simulate-neuron", response_model=NeuronSimulationResponse)
def run_neuron_simulation(request: NeuronSimulationRequest) -> NeuronSimulationResponse:
    """
    Simulate a single Leaky Integrate-and-Fire neuron.

    The simulation runs for the specified duration using discrete time steps.
    Returns the full voltage trace and spike times.
    """
    result = simulate_lif_neuron(
        params=request.params,
        I_ext=request.I_ext,
        dt=request.dt,
        duration=request.duration,
    )
    return NeuronSimulationResponse(**result)
