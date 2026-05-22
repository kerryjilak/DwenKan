"""
AI (PyTorch) Feedforward Neural Network Engine.

This module implements a simple feedforward artificial neural network using
PyTorch, designed for educational comparison with biological neuron models.

BIOLOGICAL vs ARTIFICIAL NEURON — Key Differences:
┌───────────────────┬──────────────────────┬──────────────────────┐
│ Property          │ Biological (LIF)     │ Artificial (ANN)     │
├───────────────────┼──────────────────────┼──────────────────────┤
│ Communication     │ Spikes (binary)      │ Continuous values    │
│ Temporal dynamics │ Yes (differential    │ No (instantaneous)   │
│                   │ equations over time) │                      │
│ Learning rule     │ Hebbian / STDP       │ Backpropagation      │
│ Activation        │ Threshold → spike    │ ReLU, sigmoid, etc.  │
│ Energy            │ ~20W (whole brain)   │ ~300W (GPU)          │
│ Computation       │ Asynchronous         │ Synchronous layers   │
└───────────────────┴──────────────────────┴──────────────────────┘

The forward pass computes:
    h_1 = activation(W_1 @ x + b_1)
    h_2 = activation(W_2 @ h_1 + b_2)
    ...
    output = W_n @ h_{n-1} + b_n
"""

import torch
import torch.nn as nn

from models.ai import AIModelConfig


def build_network(config: AIModelConfig) -> nn.Sequential:
    """
    Build a PyTorch Sequential feedforward network from config.

    Each hidden layer consists of:
    1. Linear transformation: y = Wx + b
    2. Activation function (models the neuron's "firing rate" response)

    The output layer has no activation — it produces raw values.
    """
    activation_map = {
        "relu": nn.ReLU,       # max(0, x) — most common in modern deep learning
        "sigmoid": nn.Sigmoid, # 1/(1+e^{-x}) — historically inspired by biological firing rates
        "tanh": nn.Tanh,       # Centered version of sigmoid, range [-1, 1]
    }

    act_fn = activation_map.get(config.activation, nn.ReLU)

    layers = []
    prev_size = config.input_size

    for hidden_size in config.hidden_sizes:
        layers.append(nn.Linear(prev_size, hidden_size))
        layers.append(act_fn())
        prev_size = hidden_size

    # Output layer — no activation (raw logits)
    layers.append(nn.Linear(prev_size, config.output_size))

    return nn.Sequential(*layers)


def run_forward_pass(
    config: AIModelConfig,
    input_data: list[list[float]],
) -> dict:
    """
    Run a forward pass and capture activations at every layer.

    This is analogous to recording voltage traces from biological neurons,
    except here we capture the continuous-valued activations at each layer.

    Args:
        config: Network architecture specification.
        input_data: Input samples as list of lists.

    Returns:
        Dictionary with 'output', 'layer_activations', 'architecture'.
    """
    model = build_network(config)

    # Use eval mode and no gradients — we're only doing inference
    model.eval()

    # Initialize weights to small random values for reproducibility
    torch.manual_seed(42)
    for param in model.parameters():
        if param.dim() > 1:
            nn.init.xavier_uniform_(param)

    input_tensor = torch.tensor(input_data, dtype=torch.float32)

    layer_activations = []
    architecture = []

    # Record input
    layer_activations.append({
        "layer_name": "Input",
        "values": input_tensor.tolist(),
    })
    architecture.append(f"Input: {config.input_size} features")

    # Forward pass with intermediate recording
    x = input_tensor
    layer_idx = 0
    with torch.no_grad():
        for i, layer in enumerate(model):
            x = layer(x)
            if isinstance(layer, nn.Linear):
                layer_idx += 1
                is_output = (i == len(model) - 1)
                name = "Output" if is_output else f"Hidden {layer_idx}"
                layer_activations.append({
                    "layer_name": name,
                    "values": x.tolist(),
                })
                if is_output:
                    architecture.append(
                        f"Output: Linear({layer.in_features} → {layer.out_features})"
                    )
                else:
                    architecture.append(
                        f"Hidden {layer_idx}: Linear({layer.in_features} → {layer.out_features}) + {config.activation}"
                    )

    return {
        "output": x.tolist(),
        "layer_activations": layer_activations,
        "architecture": architecture,
    }
