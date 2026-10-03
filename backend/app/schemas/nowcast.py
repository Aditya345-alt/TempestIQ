from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class HorizonPrediction(BaseModel):
    horizon: str  # 0-30 min, 30-60 min, 60-120 min
    probability: float
    risk_level: str  # LOW, MODERATE, HIGH, SEVERE
    confidence: float
    timestamp: str

class StormDevelopmentStage(BaseModel):
    time: str
    cell_id: str
    state: str  # Initiation, Mature Convection, Peak Severe, Dissipating
    intensity_dbz: float
    echo_top_km: float
    movement_speed_kmh: float
    movement_direction_deg: float

class NowcastResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    generated_at: str
    model_name: str
    model_version: str
    model_status: str  # DEMO / TRAINED
    horizons: List[HorizonPrediction]
    development_timeline: List[StormDevelopmentStage]
    atmospheric_indices: Dict[str, float]
    data_sources: List[str]
    is_demo: bool

class NowcastPredictRequest(BaseModel):
    location: Optional[str] = "Bhopal"
    latitude: Optional[float] = 23.2599
    longitude: Optional[float] = 77.4126
    radar_reflectivity_dbz: Optional[float] = 45.0
    radar_velocity_mps: Optional[float] = 14.0
    radar_echo_top_km: Optional[float] = 11.0
    satellite_ir_temp_k: Optional[float] = 220.0
    cloud_cooling_rate_k_hr: Optional[float] = -8.0
    lightning_strikes_15m: Optional[int] = 28
    lightning_frequency_min: Optional[float] = 1.86
    nwp_cape_j_kg: Optional[float] = 1800.0
    nwp_cin_j_kg: Optional[float] = -35.0
    nwp_shear_0_6km_mps: Optional[float] = 18.0
    nwp_lifted_index: Optional[float] = -4.5
    nwp_k_index: Optional[float] = 34.0
    precipitable_water_mm: Optional[float] = 48.0
    surface_temp_c: Optional[float] = 33.0
    surface_dew_point_c: Optional[float] = 23.0
    relative_humidity_pct: Optional[float] = 72.0
    surface_pressure_hpa: Optional[float] = 1004.0
    rain_rate_mm_hr: Optional[float] = 18.5
