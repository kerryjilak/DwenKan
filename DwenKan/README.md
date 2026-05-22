<div align="center">

# NeuroLab Lite

**An Interactive Computational Neuroscience & AI Simulation Platform**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite_8-646CFF?logo=vite)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Explore the computational principles underlying biological neural circuits and artificial neural networks — side by side, in real time.*

</div>

---

## Table of Contents

- [Overview](#overview)
- [Theoretical Background](#theoretical-background)
  - [The Leaky Integrate-and-Fire Model](#the-leaky-integrate-and-fire-model)
  - [Network Dynamics & Synaptic Transmission](#network-dynamics--synaptic-transmission)
  - [Artificial Neural Networks](#artificial-neural-networks)
  - [Bridging Biological and Artificial](#bridging-biological-and-artificial)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Simulation Presets](#simulation-presets)
- [API Reference](#api-reference)
- [Further Reading](#further-reading)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

NeuroLab Lite is an educational platform that lets you simulate, visualize, and understand neural computation at multiple levels of abstraction:

1. **Single neuron dynamics** — Observe how membrane potential evolves under injected current, and how neurons generate action potentials (spikes) through a threshold mechanism.
2. **Small-scale neural circuits** — Build networks of interconnected neurons with excitatory and inhibitory synapses to explore emergent dynamics like signal propagation, inhibition-mediated competition, and oscillations.
3. **Artificial neural networks** — Run feedforward networks with configurable architectures and compare their deterministic activation patterns against the stochastic, timing-dependent behavior of biological circuits.

All simulations run **client-side in the browser** using optimized JavaScript engines, with an optional Python/FastAPI backend for server-side computation.

---

## Theoretical Background

### The Leaky Integrate-and-Fire Model

The **Leaky Integrate-and-Fire (LIF)** neuron is one of the most widely used simplified models in computational neuroscience. It captures two essential properties of biological neurons:

1. **Integration** — The membrane acts as a capacitor, accumulating charge from synaptic inputs.
2. **Leakage** — Ion channels cause the membrane potential to decay toward a resting state.

#### Governing Equation

$$
\tau_m \frac{dV}{dt} = -(V - V_{\text{rest}}) + R_m \cdot I_{\text{ext}}
$$

Where:
| Symbol | Meaning | Typical Value |
|--------|---------|---------------|
| $V$ | Membrane potential | Variable (mV) |
| $V_{\text{rest}}$ | Resting potential | −70 mV |
| $\tau_m$ | Membrane time constant | 10 ms |
| $R_m$ | Membrane resistance | 1–100 MΩ |
| $I_{\text{ext}}$ | External input current | 0–30 nA |

#### Spike-and-Reset Rule

When $V$ reaches the threshold $V_{\text{thresh}}$ (typically −55 mV), the neuron is said to "fire":
- A spike event is recorded
- The membrane potential is instantly reset to $V_{\text{reset}}$ (typically −75 mV)

This mimics the rapid depolarization and repolarization of a real action potential without modeling the ionic currents explicitly.

#### Numerical Integration

We use **Forward Euler** discretization with configurable time step $\Delta t$:

$$
V(t + \Delta t) = V(t) + \frac{\Delta t}{\tau_m}\left[ -(V(t) - V_{\text{rest}}) + R_m \cdot I_{\text{ext}} \right]
$$

> **Why LIF?** Despite its simplicity, the LIF model correctly reproduces many experimental observations: firing rate increases monotonically with input current (the f-I curve), and regular spike trains emerge with constant input. It forms the basis for large-scale network simulations where computational efficiency matters.

---

### Network Dynamics & Synaptic Transmission

Real neural computation emerges not from single neurons, but from their **connectivity patterns**. NeuroLab Lite implements a current-based synapse model:

#### Synaptic Current Model

When a pre-synaptic neuron $j$ fires at time $t_j^f$, a current pulse is delivered to post-synaptic neuron $i$ after a conduction delay $d_{ij}$:

$$
I_{\text{syn},i}(t) = \sum_{j} w_{ij} \cdot \delta(t - t_j^f - d_{ij})
$$

Where:
- $w_{ij} > 0$ for **excitatory** synapses (mimicking glutamate/AMPA receptors)
- $w_{ij} < 0$ for **inhibitory** synapses (mimicking GABA receptors)
- $d_{ij}$ is the axonal propagation delay (in time steps)

#### Emergent Network Phenomena

The platform demonstrates several key concepts in neural circuit dynamics:

| Phenomenon | Example Preset | What You'll See |
|-----------|---------------|-----------------|
| **Signal propagation** | Feedforward Chain | Activity cascades from neuron A → B → C with delays |
| **Lateral inhibition** | Excitation-Inhibition | Inhibitory neuron suppresses excitatory activity |
| **Excitation-inhibition balance** | E-I preset | Competition between excitatory drive and inhibitory feedback |

---

### Artificial Neural Networks

The **AI Mode** implements a feedforward multilayer perceptron (MLP) using pure JavaScript matrix operations:

#### Architecture

$$
\mathbf{a}^{(l)} = f\left( \mathbf{W}^{(l)} \cdot \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)} \right)
$$

Where $f$ is a nonlinear activation function (ReLU, sigmoid, or tanh) and $\mathbf{W}^{(l)}$ are initialized using **Xavier uniform** initialization:

$$
W_{ij} \sim \mathcal{U}\left(-\sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}},\ \sqrt{\frac{6}{n_{\text{in}} + n_{\text{out}}}}\right)
$$

This ensures stable gradient flow during training — a foundational insight from [Glorot & Bengio (2010)](http://proceedings.mlr.press/v9/glorot10a.html).

---

### Bridging Biological and Artificial

A central educational goal of NeuroLab Lite is to highlight how biological and artificial neural networks relate:

| Aspect | Biological (LIF) | Artificial (MLP) |
|--------|-----------------|------------------|
| **Signal encoding** | Spike timing & rate | Continuous activations |
| **Computation** | Temporal integration + threshold | Weighted sum + nonlinearity |
| **Learning** | Spike-Timing-Dependent Plasticity (STDP) | Backpropagation (gradient descent) |
| **Connectivity** | Sparse, structured | Dense, layer-wise |
| **Time** | Explicit (ms resolution) | Implicit (forward pass = one "step") |
| **Stochasticity** | Inherent (ion channel noise) | Deterministic (given weights) |

> Both systems share the fundamental principle: **nonlinear transformation of weighted inputs produces complex computation from simple units.**

---

## Features

- **Single Neuron Simulation** — LIF model with adjustable biophysical parameters (resting potential, threshold, time constant, membrane resistance, input current)
- **Network Builder** — Visual construction of multi-neuron circuits with excitatory/inhibitory weighted connections and configurable propagation delays
- **AI Mode** — Feedforward neural network with configurable layers, activation functions, and Xavier initialization (reproducible via seeded PRNG)
- **Preset Library** — Pre-configured simulations demonstrating key neuroscience and AI concepts
- **Real-Time Visualization** — Voltage traces (Chart.js), spike raster plots, and layer activation heatmaps
- **Explanation Panel** — Context-sensitive insights about simulation results (firing rate analysis, network activity patterns)
- **Guided Onboarding** — Interactive tour for new users
- **Responsive Design** — Full mobile/tablet/desktop support

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (React)                    │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  LIF Engine   │  │ Network  │  │  AI Engine   │  │
│  │  (JS, O(n))   │  │  Engine  │  │  (JS, O(nm)) │  │
│  └──────────────┘  └──────────┘  └──────────────┘  │
│         │                │               │           │
│         ▼                ▼               ▼           │
│  ┌─────────────────────────────────────────────┐    │
│  │         React Components + Chart.js          │    │
│  │   VoltageChart · SpikeRaster · AIViz · ...   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                        │ (optional)
                        ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                 │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  LIF Engine   │  │ Network  │  │  AI Engine   │  │
│  │  (NumPy)      │  │  (NumPy) │  │  (PyTorch)   │  │
│  └──────────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────┘
```

> **Note:** All simulations run client-side by default for instant feedback. The Python backend mirrors the same algorithms and can be used for heavier computation or server-side integration.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, Vite 8 | UI framework & build tooling |
| Styling | Tailwind CSS 4 | Utility-first responsive design |
| Visualization | Chart.js + react-chartjs-2 | Voltage traces, raster plots, activation charts |
| Animation | Framer Motion | Smooth UI transitions |
| Icons | Lucide React | Consistent iconography |
| Routing | React Router 7 | SPA navigation |
| Backend | Python, FastAPI | REST API server |
| Numerics | NumPy, PyTorch | Server-side simulation engines |
| Validation | Pydantic | Request/response data models |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10 (optional, for backend)

### Frontend (required)

```bash
cd neurolab-lite/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (optional)

```bash
cd neurolab-lite/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger UI).

---

## Project Structure

```
neurolab-lite/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── engines/
│   │   ├── lif_neuron.py        # LIF neuron simulation (NumPy)
│   │   ├── network_sim.py       # Multi-neuron network simulation
│   │   └── ai_engine.py         # PyTorch feedforward NN
│   ├── models/
│   │   ├── neuron.py            # Pydantic models for neuron API
│   │   ├── network.py           # Network request/response schemas
│   │   └── ai.py                # AI model schemas
│   ├── routers/
│   │   ├── neuron.py            # POST /simulate-neuron
│   │   ├── network.py           # POST /simulate-network
│   │   ├── ai.py                # POST /simulate-ai
│   │   └── presets.py           # GET /presets, GET /presets/{name}
│   └── presets/                 # JSON preset configurations
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app — tab navigation & state
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Tailwind imports
│   │   ├── api/client.js        # Simulation API client
│   │   ├── engines/
│   │   │   ├── lifNeuron.js     # Client-side LIF engine
│   │   │   ├── networkSim.js    # Client-side network engine
│   │   │   └── aiEngine.js      # Client-side MLP forward pass
│   │   ├── components/
│   │   │   ├── ControlPanel.jsx     # Parameter controls & run button
│   │   │   ├── VoltageChart.jsx     # Membrane potential line chart
│   │   │   ├── SpikeRaster.jsx      # Spike timing scatter plot
│   │   │   ├── NetworkBuilder.jsx   # Network topology editor
│   │   │   ├── NetworkChart.jsx     # Multi-neuron voltage overlay
│   │   │   ├── AIControlPanel.jsx   # NN architecture controls
│   │   │   ├── AIVisualization.jsx  # Layer activation bar chart
│   │   │   ├── PresetSelector.jsx   # Preset configuration browser
│   │   │   ├── ExplanationPanel.jsx # Context-aware result insights
│   │   │   ├── LandingPage.jsx      # Marketing / intro page
│   │   │   ├── DwenKanLogo.jsx      # SVG brand logo
│   │   │   └── OnboardingTour.jsx   # Guided walkthrough
│   │   └── data/
│   │       └── presets.js       # Embedded preset definitions
│   ├── vite.config.js           # Vite configuration
│   └── package.json
├── netlify.toml                 # Netlify deployment config
└── README.md
```

---

## Simulation Presets

| Preset | Type | Description |
|--------|------|-------------|
| **Regular Spiking** | Neuron | Standard LIF with moderate input — steady spike train at ~6.6 Hz |
| **Fast Spiking** | Neuron | Low τ (5 ms), high current — mimics fast-spiking interneurons |
| **Subthreshold** | Neuron | Weak input (I=10 nA) — membrane depolarizes but never reaches threshold |
| **Feedforward Chain** | Network | 3-neuron chain (A→B→C) — demonstrates signal propagation with delays |
| **Excitation-Inhibition** | Network | E-I motif — shows lateral inhibition and activity shaping |

---

## API Reference

All endpoints accept and return JSON.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/simulate-neuron` | Run single LIF neuron simulation |
| `POST` | `/simulate-network` | Run multi-neuron network simulation |
| `POST` | `/simulate-ai` | Run feedforward NN forward pass |
| `GET` | `/presets` | List available presets |
| `GET` | `/presets/{filename}` | Get specific preset configuration |

### Example: Simulate a Neuron

```bash
curl -X POST http://localhost:8000/simulate-neuron \
  -H "Content-Type: application/json" \
  -d '{
    "params": {"V_rest": -70, "V_threshold": -55, "V_reset": -75, "tau": 10, "R": 1},
    "I_ext": 20,
    "dt": 0.1,
    "duration": 100
  }'
```

---

## Further Reading

### Computational Neuroscience

- **Dayan & Abbott (2001)** — *Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems*. The standard graduate textbook. [MIT Press](https://mitpress.mit.edu/9780262541855/theoretical-neuroscience/)
- **Gerstner et al. (2014)** — *Neuronal Dynamics: From Single Neurons to Networks and Models of Cognition*. Free online textbook with interactive simulations. [neuronaldynamics.epfl.ch](https://neuronaldynamics.epfl.ch/)
- **Izhikevich (2003)** — "Simple Model of Spiking Neurons." *IEEE Transactions on Neural Networks*, 14(6), 1569–1572. [DOI](https://doi.org/10.1109/TNN.2003.820440)
- **Burkitt (2006)** — "A Review of the Integrate-and-Fire Neuron Model." *Biological Cybernetics*, 95(1), 1–19. [DOI](https://doi.org/10.1007/s00422-006-0068-6)

### Neural Networks & Deep Learning

- **Glorot & Bengio (2010)** — "Understanding the difficulty of training deep feedforward neural networks." *AISTATS*. [PDF](http://proceedings.mlr.press/v9/glorot10a/glorot10a.pdf)
- **Goodfellow, Bengio & Courville (2016)** — *Deep Learning*. Comprehensive reference. [deeplearningbook.org](https://www.deeplearningbook.org/)
- **3Blue1Brown** — Neural Networks video series (excellent visual intuition). [YouTube playlist](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

### Bridging Bio & AI

- **Hassabis et al. (2017)** — "Neuroscience-Inspired Artificial Intelligence." *Neuron*, 95(2), 245–258. [DOI](https://doi.org/10.1016/j.neuron.2017.06.011)
- **Maass (1997)** — "Networks of Spiking Neurons: The Third Generation of Neural Network Models." *Neural Networks*, 10(9), 1659–1671. [DOI](https://doi.org/10.1016/S0893-6080(97)00011-7)

### Tools & Simulators

- [Brian2](https://brian2.readthedocs.io/) — Python spiking neural network simulator
- [NEURON](https://www.neuron.yale.edu/) — Biophysically detailed neuron simulation
- [NEST](https://www.nest-simulator.org/) — Large-scale network simulator
- [PyTorch](https://pytorch.org/) — Deep learning framework

---

## Contributing

Contributions are welcome! Whether it's fixing a bug, adding a new neuron model, improving documentation, or suggesting new presets:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

This project is released under the [MIT License](LICENSE).

---

<div align="center">

*Built with curiosity about the brain and a passion for making neuroscience accessible.*

**[DwenKan](https://github.com/DwenKan)** · Computational Neuroscience × AI

</div>

