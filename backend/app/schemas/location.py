from pydantic import BaseModel
from typing import List, Optional

class LocationItem(BaseModel):
    id: int
    name: str
    state: Optional[str]
    country: str
    latitude: float
    longitude: float
    elevation_m: float

class LocationsSearchResponse(BaseModel):
    locations: List[LocationItem]
