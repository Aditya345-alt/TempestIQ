from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CurrentWeatherResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    timestamp: str
    temperature_c: float
    humidity_pct: float
    wind_speed_kmh: float
    wind_direction_deg: float
    pressure_hpa: float
    rainfall_mm: float
    dew_point_c: float
    condition: str
    thunderstorm_probability: float
    lightning_risk: float
    active_storms_nearby: int
    cape_j_kg: float
    cin_j_kg: float
    shear_mps: float
    data_source: str
    is_demo: bool

class TimelinePoint(BaseModel):
    time: str
    thunderstorm_prob: float
    lightning_risk: float
    rainfall_mm: float
    intensity_score: float

class ForecastItem(BaseModel):
    time: str
    temp_c: float
    humidity_pct: float
    wind_kmh: float
    pressure_hpa: float
    rainfall_mm: float
    thunderstorm_prob: float
    lightning_risk: float
    condition: str

class WeatherForecastResponse(BaseModel):
    location: str
    timeline: List[TimelinePoint]
    forecast_horizons: List[ForecastItem]
    data_source: str
    is_demo: bool
