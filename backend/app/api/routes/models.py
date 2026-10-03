import os
import json
from fastapi import APIRouter, HTTPException
from ...schemas.models import ModelsListResponse, ModelDetail

router = APIRouter()

@router.get("/models", response_model=ModelsListResponse)
def get_models():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    meta_path = os.path.join(root_dir, "ml", "models", "model_metadata.json")
    
    if os.path.exists(meta_path):
        with open(meta_path, "r") as f:
            meta = json.load(f)
            
        model_obj = ModelDetail(
            id=1,
            name=meta.get("model_name", "TempestIQ Multi-Sensor XGBoost Ensemble"),
            version=meta.get("version", "1.0.0"),
            task=meta.get("task", "Thunderstorm & Lightning Nowcasting"),
            status="TRAINED",
            trained_at=meta.get("training_date", "2025-05-15T00:00:00"),
            total_samples=meta.get("total_samples", 4000),
            features=meta.get("features", []),
            metrics=meta.get("metrics", {}),
            safety_disclaimer="VERIFIED RESEARCH METRICS: Metrics evaluated on holdout chronological test dataset of multi-radar, satellite, lightning, and NWP observations. Never applied to uncalibrated radar sensors without retraining."
        )
        return ModelsListResponse(models=[model_obj], active_model_id=1)
    else:
        # Fallback if un-trained
        demo_model = ModelDetail(
            id=1,
            name="TempestIQ Multi-Sensor XGBoost (Baseline)",
            version="1.0.0",
            task="Thunderstorm Nowcasting",
            status="DEMO / NOT TRAINED",
            trained_at="N/A",
            total_samples=0,
            features=[],
            metrics={},
            safety_disclaimer="MODEL DEMO MODE: Training pipeline ready. Execute ml/train.py to train on real meteorological datasets."
        )
        return ModelsListResponse(models=[demo_model], active_model_id=1)

@router.get("/models/{id}/metrics")
def get_model_metrics(id: int):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
    meta_path = os.path.join(root_dir, "ml", "models", "model_metadata.json")
    if os.path.exists(meta_path):
        with open(meta_path, "r") as f:
            meta = json.load(f)
        return meta.get("metrics", {})
    raise HTTPException(status_code=404, detail="Model metrics not found")
