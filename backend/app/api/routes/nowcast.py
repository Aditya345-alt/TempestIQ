from fastapi import APIRouter, Query, Body
from typing import Optional
from ...services.nowcasting_service import nowcasting_service
from ...providers.india_risk_grid_provider import IndiaRiskGridProvider
from ...schemas.nowcast import NowcastResponse, NowcastPredictRequest
from .weather import resolve_coords

router = APIRouter()
risk_grid_provider = IndiaRiskGridProvider()

@router.get("/nowcast", response_model=NowcastResponse)
def get_nowcast(location: str = Query("Bhopal")):
    """Point nowcast for a named location."""
    lat, lon, name = resolve_coords(location)
    data = nowcasting_service.generate_nowcast(name, lat, lon)
    return data

@router.get("/nowcast/grid")
@router.get("/nowcast/risk-grid")
def get_national_risk_grid():
    """Returns AI-predicted convective risk zones across India (CAPE, Lifted Index, Flash Potential Index)."""
    return risk_grid_provider.get_national_risk_grid()

@router.get("/nowcast/location-risk")
def get_location_risk(lat: float = Query(23.25), lon: float = Query(77.41)):
    """Computes immediate convective and lightning risk profile for specific coordinates."""
    return risk_grid_provider.get_risk_for_location(lat, lon)

@router.post("/nowcast/predict", response_model=NowcastResponse)
def predict_nowcast(req: NowcastPredictRequest):
    lat, lon, name = resolve_coords(req.location or "Bhopal")
    custom_dict = req.model_dump(exclude_unset=True)
    data = nowcasting_service.generate_nowcast(name, lat, lon, custom_features=custom_dict)
    return data
