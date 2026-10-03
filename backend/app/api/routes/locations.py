from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from ...database.database import get_db
from ...database.models import Location
from ...schemas.location import LocationsSearchResponse, LocationItem

router = APIRouter()

DEFAULT_LOCATIONS = [
    {"name": "Bhopal", "state": "Madhya Pradesh", "country": "India", "latitude": 23.2599, "longitude": 77.4126, "elevation_m": 527.0},
    {"name": "Indore", "state": "Madhya Pradesh", "country": "India", "latitude": 22.7196, "longitude": 75.8577, "elevation_m": 553.0},
    {"name": "Delhi", "state": "Delhi", "country": "India", "latitude": 28.6139, "longitude": 77.2090, "elevation_m": 216.0},
    {"name": "Mumbai", "state": "Maharashtra", "country": "India", "latitude": 19.0760, "longitude": 72.8777, "elevation_m": 14.0},
    {"name": "Kolkata", "state": "West Bengal", "country": "India", "latitude": 22.5726, "longitude": 88.3639, "elevation_m": 9.0},
    {"name": "Jaipur", "state": "Rajasthan", "country": "India", "latitude": 26.9124, "longitude": 75.7873, "elevation_m": 431.0},
    {"name": "Bengaluru", "state": "Karnataka", "country": "India", "latitude": 12.9716, "longitude": 77.5946, "elevation_m": 920.0},
    {"name": "Hyderabad", "state": "Telangana", "country": "India", "latitude": 17.3850, "longitude": 78.4867, "elevation_m": 542.0},
]

@router.get("/locations/search", response_model=LocationsSearchResponse)
def search_locations(q: str = Query("", description="Search term")):
    q_lower = q.lower().strip()
    results = []
    
    for i, loc in enumerate(DEFAULT_LOCATIONS, 1):
        if not q_lower or q_lower in loc["name"].lower() or q_lower in loc["state"].lower():
            results.append(LocationItem(id=i, **loc))
            
    return LocationsSearchResponse(locations=results)
