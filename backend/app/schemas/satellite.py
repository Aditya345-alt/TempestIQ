from pydantic import BaseModel
from typing import List

class SatelliteBandMetrics(BaseModel):
    band_name: str  # Visible, Infrared, Water Vapor
    wavelength_um: float
    min_val: float
    max_val: float
    units: str
    description: str

class SatelliteFrame(BaseModel):
    timestamp: str
    time_offset_min: int
    ir_brightness_temp_k: float
    water_vapor_temp_k: float
    cloud_top_height_km: float
    cooling_rate_k_hr: float
    cloud_growth_trend: str

class SatelliteResponse(BaseModel):
    region_name: str
    satellite_name: str  # INSAT-3DR / GOES / Himawari
    bands: List[SatelliteBandMetrics]
    frames: List[SatelliteFrame]
    current_metrics: SatelliteFrame
    data_source: str
    is_demo: bool
    last_updated: str
