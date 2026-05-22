"""
Router for preset configurations and save/load functionality.
"""

import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["presets"])

PRESETS_DIR = Path(__file__).parent.parent / "presets"
CONFIGS_DIR = Path(__file__).parent.parent / "user_configs"


class PresetInfo(BaseModel):
    name: str
    description: str
    type: str
    filename: str


class SaveConfigRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    config: dict


@router.get("/presets")
def list_presets() -> list[PresetInfo]:
    """List all available preset simulations."""
    presets = []
    for path in sorted(PRESETS_DIR.glob("*.json")):
        data = json.loads(path.read_text())
        presets.append(PresetInfo(
            name=data.get("name", path.stem),
            description=data.get("description", ""),
            type=data.get("type", "neuron"),
            filename=path.stem,
        ))
    return presets


@router.get("/presets/{filename}")
def get_preset(filename: str) -> dict:
    """Get a specific preset configuration by filename."""
    # Sanitize: only allow alphanumeric and underscores
    safe_name = "".join(c for c in filename if c.isalnum() or c == "_")
    path = PRESETS_DIR / f"{safe_name}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    return json.loads(path.read_text())


@router.post("/configs/save")
def save_config(request: SaveConfigRequest) -> dict:
    """Save a user configuration to a JSON file."""
    CONFIGS_DIR.mkdir(exist_ok=True)
    safe_name = "".join(c for c in request.name if c.isalnum() or c in "_ -")
    if not safe_name:
        raise HTTPException(status_code=400, detail="Invalid config name")
    path = CONFIGS_DIR / f"{safe_name}.json"
    path.write_text(json.dumps(request.config, indent=2))
    return {"status": "saved", "name": safe_name}


@router.get("/configs")
def list_configs() -> list[str]:
    """List saved user configurations."""
    if not CONFIGS_DIR.exists():
        return []
    return [p.stem for p in sorted(CONFIGS_DIR.glob("*.json"))]


@router.get("/configs/{name}")
def load_config(name: str) -> dict:
    """Load a saved user configuration."""
    safe_name = "".join(c for c in name if c.isalnum() or c in "_ -")
    path = CONFIGS_DIR / f"{safe_name}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Config not found")
    return json.loads(path.read_text())
