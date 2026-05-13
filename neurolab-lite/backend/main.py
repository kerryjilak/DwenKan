"""
NeuroLab Lite — FastAPI Backend

A step-based neural simulation server providing:
- Single LIF neuron simulation
- (Future) Network simulation
- (Future) AI model comparison
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.neuron import router as neuron_router
from routers.network import router as network_router
from routers.ai import router as ai_router
from routers.presets import router as presets_router

app = FastAPI(
    title="NeuroLab Lite",
    description="Educational neuroengineering simulation platform",
    version="0.1.0",
)

# CORS: allow the Vite dev server to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(neuron_router)
app.include_router(network_router)
app.include_router(ai_router)
app.include_router(presets_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
