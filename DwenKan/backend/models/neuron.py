"""
Pydantic models for single neuron simulation.

The Leaky Integrate-and-Fire (LIF) model is one of the simplest biologically
plausible neuron models. It captures the key behavior: a neuron integrates
incoming current, and when its membrane voltage crosses a threshold, it "fires"
(produces a spike) and resets.
"""

from pydantic import BaseModel, Field


class NeuronParams(BaseModel):
    """Parameters defining a single LIF neuron.

    Biological context:
    - V_rest: the resting membrane potential (~-70 mV in real neurons)
    - V_threshold: voltage at which an action potential is triggered (~-55 mV)
    - V_reset: voltage the membrane returns to after a spike (~-75 mV, due to
      after-hyperpolarization)
    - tau: membrane time constant — how quickly voltage decays back to rest.
      Larger tau = slower decay = longer memory of past inputs.
    - R: membrane resistance — scales how much input current affects voltage.
    """

    V_rest: float = Field(default=-70.0, description="Resting membrane potential (mV)")
    V_threshold: float = Field(default=-55.0, description="Spike threshold (mV)")
    V_reset: float = Field(default=-75.0, description="Reset potential after spike (mV)")
    tau: float = Field(default=10.0, gt=0, description="Membrane time constant (ms)")
    R: float = Field(default=1.0, gt=0, description="Membrane resistance (MΩ)")


class NeuronSimulationRequest(BaseModel):
    """Request body for running a single neuron simulation."""

    params: NeuronParams = Field(default_factory=NeuronParams)
    I_ext: float = Field(default=20.0, description="Constant external input current (nA)")
    dt: float = Field(default=0.1, gt=0, le=10.0, description="Time step size (ms)")
    duration: float = Field(default=100.0, gt=0, le=10000.0, description="Total simulation time (ms)")


class NeuronSimulationResponse(BaseModel):
    """Response containing full simulation results."""

    time: list[float] = Field(description="Time points (ms)")
    voltage: list[float] = Field(description="Membrane voltage at each time step (mV)")
    spikes: list[float] = Field(description="Times at which spikes occurred (ms)")
    num_spikes: int = Field(description="Total number of spikes")
