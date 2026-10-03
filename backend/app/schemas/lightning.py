from pydantic import BaseModel
from typing import List

class LightningStrike(BaseModel):
    id: str
    lat: float
    lon: float
    time: str
    peak_current_ka: float
    strike_type: str  # CG (Cloud-to-Ground) or IC (Intra-Cloud)
    polarity: str     # Positive / Negative

class StrikeTimeSeries(BaseModel):
    time: str
    strikes_count: int
    flash_rate: float
    predicted_risk_pct: float

class LightningResponse(BaseModel):
    location: str
    current_strikes_15m: int
    strike_density_sqkm: float
    flash_rate_per_min: float
    peak_current_ka: float
    recent_activity_trend: str
    predicted_lightning_risk_pct: float  # Labelled as predicted risk, never confirmed future strikes
    observed_strikes: List[LightningStrike]
    timeline: List[StrikeTimeSeries]
    data_source: str
    is_demo: bool
    safety_disclaimer: str
