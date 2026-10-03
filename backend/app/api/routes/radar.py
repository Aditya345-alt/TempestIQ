from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from ...providers.radar_provider import radar_provider
from ...providers.multi_radar_provider import MultiRadarProvider
from ...schemas.radar import RadarResponse
from .weather import resolve_coords

router = APIRouter()
multi_radar = MultiRadarProvider()

@router.get("/radar", response_model=RadarResponse)
def get_radar(location: str = Query("Bhopal")):
    """Legacy single-station radar view centered on query location."""
    lat, lon, name = resolve_coords(location)
    data = radar_provider.get_radar_visualization(lat, lon, name)
    return data

@router.get("/radar/stations")
def get_radar_stations() -> List[Dict[str, Any]]:
    """Returns all 22 IMD Doppler Weather Radar stations with technical specs and status."""
    return multi_radar.get_stations()

@router.get("/radar/station/{station_id}")
def get_radar_station(station_id: str):
    """Returns single radar station telemetry and active cells."""
    station = multi_radar.get_station_by_id(station_id)
    if not station:
        raise HTTPException(status_code=404, detail=f"Radar station {station_id} not found.")
    return station

@router.get("/radar/current")
@router.get("/radar/composite")
def get_current_composite(offset_min: int = Query(0, description="Time offset in minutes (-60 to +30)")):
    """Returns India-wide multi-radar composite reflectivity points."""
    return multi_radar.get_composite_reflectivity(time_offset_min=offset_min)

@router.get("/radar/animation")
@router.get("/radar/series")
def get_radar_animation():
    """Returns 7 sequential radar composite frames from -60m to +30m."""
    return multi_radar.get_radar_animation_frames()
