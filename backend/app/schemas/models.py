from pydantic import BaseModel
from typing import Dict, Any, List, Optional

class FeatureImportance(BaseModel):
    name: str
    importance: float

class ConfusionMatrix(BaseModel):
    true_negatives: int
    false_positives: int
    false_negatives: int
    true_positives: int

class RocPoint(BaseModel):
    fpr: float
    tpr: float

class MeteorologicalMetrics(BaseModel):
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    brier_score: float
    pod: float  # Probability of Detection
    far: float  # False Alarm Ratio
    csi: float  # Critical Success Index
    confusion_matrix: ConfusionMatrix
    roc_curve: List[RocPoint]

class ModelDetail(BaseModel):
    id: int
    name: str
    version: str
    task: str
    status: str  # DEMO / TRAINED
    trained_at: str
    total_samples: Optional[int] = 4000
    features: List[FeatureImportance]
    metrics: Dict[str, MeteorologicalMetrics]
    safety_disclaimer: str

class ModelsListResponse(BaseModel):
    models: List[ModelDetail]
    active_model_id: int
