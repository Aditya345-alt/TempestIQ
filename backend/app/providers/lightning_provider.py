import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List

class LightningDataProvider:
    def __init__(self):
        pass

    def get_lightning_activity(self, lat: float, lon: float, location_name: str) -> Dict[str, Any]:
        now = datetime.utcnow()
        np.random.seed(int(lat * 50 + lon))
        
        # Observed strikes within last 15 minutes around storm cell
        observed_strikes = []
        n_strikes = 42
        for i in range(n_strikes):
            strike_time = now - timedelta(seconds=int(np.random.uniform(10, 900)))
            r = np.random.exponential(0.12)
            theta = np.random.uniform(0, 2 * np.pi)
            s_lat = lat + r * np.cos(theta)
            s_lon = lon + r * np.sin(theta) * 1.05
            
            c_type = "CG" if np.random.rand() < 0.35 else "IC"
            polarity = "Negative" if np.random.rand() < 0.88 else "Positive"
            peak_current = float(np.random.uniform(15, 65) if c_type == "CG" else np.random.uniform(5, 25))
            
            observed_strikes.append({
                "id": f"LTG-{now.strftime('%Y%m%d%H%M')}-{i+1:03d}",
                "lat": round(float(s_lat), 4),
                "lon": round(float(s_lon), 4),
                "time": strike_time.strftime("%H:%M:%S UTC"),
                "peak_current_ka": round(peak_current, 1),
                "strike_type": c_type,
                "polarity": polarity,
            })
            
        # Timeline (last 60m in 5m intervals)
        timeline = []
        for offset in range(-60, 5, 5):
            t = now + timedelta(minutes=offset)
            intensity = np.exp(-((offset + 10) ** 2) / 350.0)
            strikes = int(max(2, 45 * intensity + np.random.uniform(-4, 4)))
            flash_rate = round(strikes / 5.0, 2)
            # Predicted risk percentage for future intervals
            pred_risk = round(min(95, max(10, 75 * intensity + 10)), 1)
            
            timeline.append({
                "time": t.strftime("%H:%M"),
                "strikes_count": strikes,
                "flash_rate": flash_rate,
                "predicted_risk_pct": pred_risk
            })
            
        return {
            "location": location_name,
            "current_strikes_15m": n_strikes,
            "strike_density_sqkm": 0.54,
            "flash_rate_per_min": 2.8,
            "peak_current_ka": 54.2,
            "recent_activity_trend": "Increasing Flash Rate (Convective Jump Detected)",
            "predicted_lightning_risk_pct": 68.5,
            "observed_strikes": observed_strikes,
            "timeline": timeline,
            "data_source": "Ground-Based Lightning Location Network (SIMULATED)",
            "is_demo": True,
            "safety_disclaimer": "CRITICAL SAFETY NOTICE: This layer displays 'Predicted lightning risk' probabilities based on multi-sensor atmospheric observations. Predicted lightning risk indicates spatial atmospheric vulnerability and is NEVER a guarantee of confirmed strike locations."
        }

lightning_provider = LightningDataProvider()
