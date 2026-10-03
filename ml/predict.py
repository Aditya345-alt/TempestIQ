"""
TempestIQ - Model Prediction & Inference Module
Loads trained models and produces real-time nowcast probabilities and confidence levels.
"""

import os
import joblib
import numpy as np
from typing import Dict, Any, List

FEATURE_COLS = [
    "radar_reflectivity_dbz",
    "radar_velocity_mps",
    "radar_echo_top_km",
    "satellite_ir_temp_k",
    "cloud_cooling_rate_k_hr",
    "lightning_strikes_15m",
    "lightning_frequency_min",
    "nwp_cape_j_kg",
    "nwp_cin_j_kg",
    "nwp_shear_0_6km_mps",
    "nwp_lifted_index",
    "nwp_k_index",
    "precipitable_water_mm",
    "surface_temp_c",
    "surface_dew_point_c",
    "relative_humidity_pct",
    "surface_pressure_hpa",
    "rain_rate_mm_hr",
]

class NowcastInferenceEngine:
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
        self.models_dir = models_dir
        self.is_loaded = False
        self.scaler = None
        self.models = {}
        self.load_models()

    def load_models(self):
        scaler_path = os.path.join(self.models_dir, "scaler.joblib")
        if os.path.exists(scaler_path):
            try:
                self.scaler = joblib.load(scaler_path)
                for h in ["30m", "60m", "120m"]:
                    m_path = os.path.join(self.models_dir, f"xgb_{h}.joblib")
                    if os.path.exists(m_path):
                        self.models[h] = joblib.load(m_path)
                self.is_loaded = len(self.models) == 3
            except Exception as e:
                print(f"Warning: Failed loading models: {e}")
                self.is_loaded = False

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        if not self.is_loaded:
            # Physics-based baseline heuristic if models not trained yet
            cape = features.get("nwp_cape_j_kg", 1500)
            refl = features.get("radar_reflectivity_dbz", 35)
            ltg = features.get("lightning_strikes_15m", 10)
            cooling = features.get("cloud_cooling_rate_k_hr", -5)
            
            p30 = min(0.99, max(0.05, 0.4 * (refl / 65) + 0.3 * (ltg / 80) + 0.2 * (cape / 3500) + 0.1 * (abs(min(0, cooling)) / 20)))
            p60 = min(0.98, max(0.04, p30 * 0.92))
            p120 = min(0.95, max(0.02, p60 * 0.85))
            
            return {
                "model_status": "DEMO / HEURISTIC",
                "horizons": {
                    "0_30m": {"probability": round(p30, 3), "risk_level": self._risk_level(p30), "confidence": 0.75},
                    "30_60m": {"probability": round(p60, 3), "risk_level": self._risk_level(p60), "confidence": 0.70},
                    "60_120m": {"probability": round(p120, 3), "risk_level": self._risk_level(p120), "confidence": 0.62},
                }
            }
            
        # Format input vector
        vec = np.array([[features.get(col, 0.0) for col in FEATURE_COLS]])
        vec_scaled = self.scaler.transform(vec)
        
        horizons = {}
        for h, model in self.models.items():
            prob = float(model.predict_proba(vec_scaled)[0, 1])
            confidence = float(max(prob, 1 - prob))
            key = f"0_{h}" if h == "30m" else ("30_60m" if h == "60m" else "60_120m")
            horizons[key] = {
                "probability": round(prob, 3),
                "risk_level": self._risk_level(prob),
                "confidence": round(confidence, 3),
            }
            
        return {
            "model_status": "TRAINED",
            "model_name": "TempestIQ Multi-Sensor XGBoost",
            "horizons": horizons,
        }

    def _risk_level(self, prob: float) -> str:
        if prob < 0.25:
            return "LOW"
        elif prob < 0.55:
            return "MODERATE"
        elif prob < 0.80:
            return "HIGH"
        return "SEVERE"

inference_engine = NowcastInferenceEngine()
