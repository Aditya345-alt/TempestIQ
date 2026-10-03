from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from ...providers.lightning_provider import lightning_provider
from ...providers.india_lightning_provider import IndiaLightningProvider
from ...schemas.lightning import LightningResponse
from .weather import resolve_coords

router = APIRouter()
india_lightning = IndiaLightningProvider()

@router.get("/lightning", response_model=LightningResponse)
def get_lightning(location: str = Query("Bhopal")):
    """Legacy single-location lightning summary."""
    lat, lon, name = resolve_coords(location)
    data = lightning_provider.get_lightning_activity(lat, lon, name)
    return data

@router.get("/lightning/recent")
@router.get("/lightning/live")
def get_recent_strikes(lookback_min: int = Query(60, ge=5, le=120, description="Lookback window in minutes (5 to 120)")):
    """Returns all-India observed lightning strikes with CG/IC classification, polarity, and age."""
    return india_lightning.get_observed_strikes(lookback_minutes=lookback_min)

@router.get("/lightning/stats")
def get_lightning_stats():
    """Returns quick national lightning activity metrics and strike rates."""
    data = india_lightning.get_observed_strikes(lookback_minutes=15)
    return {
        "strikes_last_15m": data["strikes_last_15m"],
        "flash_rate_per_min": data["flash_rate_per_min"],
        "cg_strikes_count": data["cg_strikes_count"],
        "ic_strikes_count": data["ic_strikes_count"],
        "peak_current_max_ka": data["peak_current_max_ka"],
        "source": data["source"]
    }
