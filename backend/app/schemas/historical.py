from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class HistoricalTrendPoint(BaseModel):
    date: str
    storm_frequency: int
    lightning_strikes: int
    avg_rainfall_mm: float
    high_risk_hours: float

class DatasetSummary(BaseModel):
    id: int
    name: str
    row_count: int
    date_range: str
    uploaded_at: str
    missing_values_count: int
    features: List[str]
    locations: List[str]

class HistoricalAnalyticsResponse(BaseModel):
    datasets: List[DatasetSummary]
    selected_dataset: Optional[DatasetSummary]
    trends: List[HistoricalTrendPoint]
    preview_rows: List[Dict[str, Any]]
