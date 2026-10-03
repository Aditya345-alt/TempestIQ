from pydantic import BaseModel
from typing import List, Optional

class RadarGridPoint(BaseModel):
    lat: float
    lon: float
    reflectivity_dbz: float
    velocity_mps: float

class RadarFrame(BaseModel):
    timestamp: str
    time_offset_min: int  # -30, -20, -10, 0 (current), +15 (pred), +30 (pred)
    frame_type: str  # historical, current, projected
    max_dbz: float
    echo_top_km: float
    points: List[RadarGridPoint]

class RadarResponse(BaseModel):
    station_name: str
    latitude: float
    longitude: float
    range_km: float
    frames: List[RadarFrame]
    data_source: str
    status_label: str  # "SIMULATED RADAR DATA" or "OPERATIONAL RADAR FEED"
    is_simulated: bool
    last_updated: str
