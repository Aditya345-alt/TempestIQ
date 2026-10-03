from fastapi import APIRouter, Query
from ...providers.satellite_provider import satellite_provider
from ...schemas.satellite import SatelliteResponse
from .weather import resolve_coords

router = APIRouter()

@router.get("/satellite", response_model=SatelliteResponse)
def get_satellite(location: str = Query("Bhopal")):
    lat, lon, name = resolve_coords(location)
    data = satellite_provider.get_satellite_observations(lat, lon, name)
    return data
