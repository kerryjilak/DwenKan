"""
Pydantic models for AI (PyTorch) neural network simulation.

This module defines the data structures for running a simple feedforward
artificial neural network and comparing its behavior with biological neurons.
"""

from pydantic import BaseModel, Field


class AIModelConfig(BaseModel):
    """Configuration for a simple feedforward neural network.

    Unlike biological neurons which use membrane dynamics (differential
    equations), artificial neurons compute:
        output = activation(W @ input + b)

    Key differences from biological neurons:
    - No temporal dynamics — computation is instantaneous
    - No spike-based communication — continuous valued outputs
    - Learned weights via backpropagation (not Hebbian learning)
    - Activation functions (ReLU, sigmoid) are simplified models of
      biological firing rate curves
    """

    input_size: int = Field(default=2, ge=1, le=100, description="Number of input features")
    hidden_sizes: list[int] = Field(
        default=[4, 4],
        description="Number of neurons per hidden layer",
    )
    output_size: int = Field(default=1, ge=1, le=100, description="Number of output neurons")
    activation: str = Field(
        default="relu",
        description="Activation function: relu, sigmoid, or tanh",
    )


class AISimulationRequest(BaseModel):
    """Request to run a forward pass through an artificial neural network."""

    config: AIModelConfig = Field(default_factory=AIModelConfig)
    input_data: list[list[float]] = Field(
        default=[[1.0, 0.5]],
        description="Input samples (batch_size x input_size)",
    )


class LayerActivation(BaseModel):
    """Activations at a single layer."""

    layer_name: str
    values: list[list[float]]


class AISimulationResponse(BaseModel):
    """Response with layer-by-layer activations for visualization."""

    output: list[list[float]] = Field(description="Final network output")
    layer_activations: list[LayerActivation] = Field(
        description="Activations at each layer (input, hidden, output)"
    )
    architecture: list[str] = Field(description="Human-readable layer descriptions")
