from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from ...services.storm_tracking_service import storm_tracking_service
from ...providers.storm_tracking_provider import StormTrackingProvider
from ...schemas.storms import StormsResponse
from .weather import resolve_coords

router = APIRouter()
storm_tracker = StormTrackingProvider()

@router.get("/storms", response_model=StormsResponse)
def get_storms(location: str = Query("Bhopal")):
    """Legacy local storm detection."""
    lat, lon, _ = resolve_coords(location)
    data = storm_tracking_service.get_active_storms(lat, lon)
    return data

@router.get("/storms/current")
@router.get("/storms/tracked")
def get_active_storms_india():
    """Returns all active convective storm cells tracked across India with past and projected tracks."""
    return storm_tracker.get_active_storms()

@router.get("/storms/tracks")
def get_storm_tracks():
    """Returns vector paths and downstream impact ETAs for all active cells."""
    return storm_tracker.get_active_storms()
