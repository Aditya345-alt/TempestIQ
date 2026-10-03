from pydantic import BaseModel
from typing import List

class StormTrackPointSchema(BaseModel):
    timestamp: str
    latitude: float
    longitude: float
    intensity_dbz: float
    point_type: str  # historical, current, predicted

class StormDetail(BaseModel):
    id: int
    storm_code: str
    name: str
    latitude: float
    longitude: float
    direction_deg: float
    speed_kmh: float
    intensity_dbz: float
    severity: str  # LOW, MODERATE, HIGH, SEVERE
    status: str
    confidence: float
    timestamp: str
    observed_path: List[StormTrackPointSchema]
    current_position: StormTrackPointSchema
    predicted_path: List[StormTrackPointSchema]

class StormsResponse(BaseModel):
    total_active_storms: int
    storms: List[StormDetail]
    data_source: str
    last_updated: str
