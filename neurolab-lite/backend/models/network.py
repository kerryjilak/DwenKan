"""
Pydantic models for multi-neuron network simulation.

A neural network here is a collection of LIF neurons connected by weighted
synaptic connections. When a pre-synaptic neuron fires, it delivers current
to post-synaptic neurons proportional to the connection weight (after a delay).
"""

from pydantic import BaseModel, Field
from models.neuron import NeuronParams


class Connection(BaseModel):
    """A directed synaptic connection between two neurons.

    Biological context:
    - weight > 0: excitatory synapse (e.g., glutamatergic) — depolarizes target
    - weight < 0: inhibitory synapse (e.g., GABAergic) — hyperpolarizes target
    - delay: axonal conduction delay in time steps
    """

    source_id: str = Field(description="ID of the pre-synaptic neuron")
    target_id: str = Field(description="ID of the post-synaptic neuron")
    weight: float = Field(default=5.0, description="Synaptic weight (mV equivalent current)")
    delay: int = Field(default=1, ge=1, le=100, description="Propagation delay (time steps)")


class NetworkNeuron(BaseModel):
    """A neuron within a network, with an ID and its biophysical parameters."""

    id: str = Field(description="Unique neuron identifier")
    params: NeuronParams = Field(default_factory=NeuronParams)


class NetworkSimulationRequest(BaseModel):
    """Request body for running a network simulation."""

    neurons: list[NetworkNeuron] = Field(min_length=1, max_length=50)
    connections: list[Connection] = Field(default_factory=list)
    external_currents: dict[str, float] = Field(
        default_factory=dict,
        description="Constant external current per neuron ID (nA). Neurons not listed get 0.",
    )
    dt: float = Field(default=0.1, gt=0, le=10.0, description="Time step (ms)")
    duration: float = Field(default=100.0, gt=0, le=10000.0, description="Total time (ms)")


class NetworkSimulationResponse(BaseModel):
    """Response containing simulation results for all neurons."""

    time: list[float]
    voltages: dict[str, list[float]] = Field(description="Neuron ID → voltage trace")
    spikes: dict[str, list[float]] = Field(description="Neuron ID → spike times")
    neuron_ids: list[str]
