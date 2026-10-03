from pydantic import BaseModel
from typing import List, Optional

class AlertRuleCreate(BaseModel):
    location_name: str
    thunderstorm_threshold: float = 70.0
    lightning_threshold: float = 60.0
    notify_method: str = "Email"
    notify_target: str = "ops-center@tempestiq.internal"

class AlertRuleResponse(BaseModel):
    id: int
    location_name: str
    thunderstorm_threshold: float
    lightning_threshold: float
    notify_method: str
    notify_target: str
    is_active: bool
    created_at: str

class AlertItem(BaseModel):
    id: int
    location_name: str
    risk_level: str  # LOW, MODERATE, HIGH, SEVERE
    reason: str
    timestamp: str
    data_source: str
    model_version: str
    is_active: bool

class AlertsOverviewResponse(BaseModel):
    active_alerts: List[AlertItem]
    alert_history: List[AlertItem]
    alert_rules: List[AlertRuleResponse]
    safety_notice: str
