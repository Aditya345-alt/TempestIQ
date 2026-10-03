"""
Geographic hierarchy API routes for India Boundary, States, Districts, and Cities.
"""
import os
import json
from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any, List, Optional

router = APIRouter()

GEO_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "geo")

def load_json_file(filename: str):
    path = os.path.join(GEO_DIR, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Dataset {filename} not found.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/map/india")
@router.get("/map/boundary")
def get_india_boundary():
    """Returns official polygon boundary for Republic of India."""
    return load_json_file("india_boundary.geojson")

@router.get("/map/radars")
def get_map_radars():
    """Returns radar network dataset."""
    return load_json_file("radar_network.json")

@router.get("/map/states")
def get_india_states():
    """Returns 36 States and Union Territories GeoJSON with centers, capitals, and risk."""
    return load_json_file("india_states.geojson")

@router.get("/map/districts")
def get_india_districts(state: Optional[str] = Query(None, description="Filter by state name")):
    """Returns district polygons and meteorological threat levels."""
    data = load_json_file("india_districts.geojson")
    if state:
        filtered_features = [
            f for f in data.get("features", [])
            if f.get("properties", {}).get("state", "").lower() == state.lower()
        ]
        return {
            "type": "FeatureCollection",
            "features": filtered_features
        }
    return data

@router.get("/map/cities")
def get_india_cities(state: Optional[str] = Query(None)):
    """Returns major cities across India with weather station metadata."""
    cities = load_json_file("india_cities.json")
    if state:
        return [c for c in cities if c.get("state", "").lower() == state.lower()]
    return cities

@router.get("/map/search")
def search_locations(q: str = Query(..., min_length=2)):
    """Fuzzy search across Indian cities, districts, and states."""
    query = q.lower().strip()
    cities = load_json_file("india_cities.json")
    districts_geo = load_json_file("india_districts.geojson")
    states_geo = load_json_file("india_states.geojson")

    results = []

    # Search cities
    for c in cities:
        if query in c["name"].lower() or query in c["district"].lower() or query in c["state"].lower():
            results.append({
                "type": "CITY",
                "name": c["name"],
                "district": c["district"],
                "state": c["state"],
                "lat": c["lat"],
                "lon": c["lon"],
                "label": f"{c['name']}, {c['district']}, {c['state']}",
                "is_capital": c.get("is_capital", False)
            })

    # Search districts
    for d in districts_geo.get("features", []):
        props = d.get("properties", {})
        d_name = props.get("name", "")
        s_name = props.get("state", "")
        if query in d_name.lower():
            results.append({
                "type": "DISTRICT",
                "name": d_name,
                "district": d_name,
                "state": s_name,
                "lat": props.get("center", [0, 0])[0],
                "lon": props.get("center", [0, 0])[1],
                "label": f"District {d_name}, {s_name}",
                "risk_level": props.get("risk_level", "LOW")
            })

    # Search states
    for s in states_geo.get("features", []):
        props = s.get("properties", {})
        s_name = props.get("name", "")
        if query in s_name.lower():
            results.append({
                "type": "STATE",
                "name": s_name,
                "state": s_name,
                "capital": props.get("capital", ""),
                "lat": props.get("center", [0, 0])[0],
                "lon": props.get("center", [0, 0])[1],
                "label": f"{s_name} ({props.get('type', 'State')})",
                "risk_level": props.get("thunderstorm_risk", "MODERATE")
            })

    # Deduplicate by label
    unique_results = []
    seen = set()
    for r in results:
        if r["label"] not in seen:
            seen.add(r["label"])
            unique_results.append(r)

    return unique_results[:12]
