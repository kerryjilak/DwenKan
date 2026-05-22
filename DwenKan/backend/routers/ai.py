"""
Router for AI neural network simulation endpoints.
"""

from fastapi import APIRouter

from models.ai import AISimulationRequest, AISimulationResponse
from engines.ai_engine import run_forward_pass

router = APIRouter(tags=["ai"])


@router.post("/simulate-ai", response_model=AISimulationResponse)
def run_ai_simulation(request: AISimulationRequest) -> AISimulationResponse:
    """
    Run a forward pass through a feedforward artificial neural network.

    Returns layer-by-layer activations for visualization and comparison
    with biological neuron simulations.
    """
    result = run_forward_pass(
        config=request.config,
        input_data=request.input_data,
    )
    return AISimulationResponse(**result)
