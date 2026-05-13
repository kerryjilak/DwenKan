# NeuroLab Lite

A portfolio-grade educational neuroengineering + AI hybrid simulation platform.

Simulate biologically-inspired Leaky Integrate-and-Fire (LIF) neurons, build small neural networks, and compare them side-by-side with artificial neural networks powered by PyTorch.

## Features

- **Single Neuron Simulation** — LIF model with adjustable biophysical parameters (threshold, time constant, membrane resistance)
- **Network Simulation** — Multiple interconnected neurons with weighted synaptic connections and propagation delays
- **AI Mode** — PyTorch feedforward neural network with layer-by-layer activation visualization
- **Preset Library** — Pre-configured simulations (Regular Spiking, Fast Spiking, Subthreshold, Feedforward Chain, Excitation-Inhibition)
- **Interactive Charts** — Voltage traces, spike raster plots, and activation bar charts
- **Save/Load Configs** — Persist simulation configurations as JSON

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, NumPy, PyTorch |
| Frontend | React, Vite, TailwindCSS, Chart.js |
| Protocol | REST API (step-based, no WebSockets) |

## Project Structure

```
neurolab-lite/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt
│   ├── engines/
│   │   ├── lif_neuron.py        # LIF neuron simulation
│   │   ├── network_sim.py       # Multi-neuron network
│   │   └── ai_engine.py         # PyTorch feedforward NN
│   ├── models/
│   │   ├── neuron.py            # Neuron data models
│   │   ├── network.py           # Network data models
│   │   └── ai.py                # AI data models
│   ├── routers/
│   │   ├── neuron.py            # POST /simulate-neuron
│   │   ├── network.py           # POST /simulate-network
│   │   ├── ai.py                # POST /simulate-ai
│   │   └── presets.py           # GET /presets, POST /configs
│   └── presets/                 # JSON preset configs
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main app with tab navigation
│   │   ├── api/client.js        # API client
│   │   └── components/
│   │       ├── ControlPanel.jsx
│   │       ├── VoltageChart.jsx
│   │       ├── SpikeRaster.jsx
│   │       ├── NetworkBuilder.jsx
│   │       ├── NetworkChart.jsx
│   │       ├── AIControlPanel.jsx
│   │       ├── AIVisualization.jsx
│   │       └── PresetSelector.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# For CPU-only PyTorch (lighter):
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Start server
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. The Vite dev server proxies API requests to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/simulate-neuron` | Run single LIF neuron simulation |
| POST | `/simulate-network` | Run multi-neuron network simulation |
| POST | `/simulate-ai` | Run PyTorch forward pass |
| GET | `/presets` | List preset configurations |
| GET | `/presets/{name}` | Get a specific preset |
| POST | `/configs/save` | Save user configuration |
| GET | `/configs` | List saved configs |
| GET | `/configs/{name}` | Load a saved config |
| GET | `/health` | Health check |

## The Science

### LIF Model

The Leaky Integrate-and-Fire neuron is governed by:

$$\tau \frac{dV}{dt} = -(V - V_{rest}) + R \cdot I_{ext}$$

Discretized with forward Euler:

$$V[t+1] = V[t] + \frac{dt}{\tau} \left( -(V[t] - V_{rest}) + R \cdot I_{ext} \right)$$

When $V \geq V_{threshold}$:
- Spike recorded at time $t$
- $V$ reset to $V_{reset}$

### Biological vs Artificial Neurons

| Property | Biological (LIF) | Artificial (ANN) |
|----------|-------------------|-------------------|
| Communication | Spikes (binary events) | Continuous values |
| Temporal dynamics | Yes (differential equations) | No (instantaneous) |
| Learning | Hebbian / STDP | Backpropagation |
| Activation | Threshold → spike | ReLU, sigmoid, tanh |
| Energy | ~20W (whole brain) | ~300W (GPU) |

## License

MIT
