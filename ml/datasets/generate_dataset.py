"""
TempestIQ - Meteorological Synthetic Dataset Generator
Generates physically consistent atmospheric observations representing multi-radar,
satellite, lightning, and NWP model data across Indian & global thunderstorm-prone corridors.
"""

import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta

def generate_meteorological_dataset(n_samples: int = 5000, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    start_date = datetime(2025, 4, 1, 0, 0)
    
    locations = [
        {"name": "Bhopal", "lat": 23.2599, "lon": 77.4126},
        {"name": "Indore", "lat": 22.7196, "lon": 75.8577},
        {"name": "Delhi", "lat": 28.6139, "lon": 77.2090},
        {"name": "Mumbai", "lat": 19.0760, "lon": 72.8777},
        {"name": "Kolkata", "lat": 22.5726, "lon": 88.3639},
        {"name": "Jaipur", "lat": 26.9124, "lon": 75.7873},
        {"name": "Bengaluru", "lat": 12.9716, "lon": 77.5946},
        {"name": "Hyderabad", "lat": 17.3850, "lon": 78.4867},
    ]

    records = []
    
    for i in range(n_samples):
        loc = locations[i % len(locations)]
        # Timestamp sequentially forward
        dt = start_date + timedelta(minutes=15 * (i // len(locations)))
        
        # Convective available potential energy (CAPE)
        cape = float(np.random.choice([
            np.random.uniform(100, 800),     # Stable/mild
            np.random.uniform(800, 2200),    # Moderate instability
            np.random.uniform(2200, 4200),   # Severe thunderstorm potential
        ], p=[0.55, 0.30, 0.15]))
        
        # Convective Inhibition (CIN)
        cin = float(np.random.uniform(-180, 0) if cape < 1500 else np.random.uniform(-60, 0))
        
        # Vertical Wind Shear 0-6km (m/s)
        shear = float(np.random.uniform(5, 38))
        
        # Surface Temperature (C) & Dew Point (C)
        temp_c = float(np.random.uniform(24, 41))
        dew_point_c = float(np.clip(temp_c - np.random.uniform(3, 14), 12, 28))
        rh = float(np.clip(100 - 5 * (temp_c - dew_point_c), 30, 98))
        pressure_hpa = float(np.random.uniform(995, 1018))
        
        # Instability indices
        lifted_index = float(-0.003 * cape + np.random.normal(0, 1.2))
        k_index = float(temp_c - dew_point_c + 20 + np.random.normal(0, 3))
        pw_mm = float(np.clip(dew_point_c * 2.2 + np.random.uniform(5, 18), 15, 75))
        
        # Instability combined indicator
        instability = (cape / 3000.0) * 0.4 + (shear / 35.0) * 0.2 + (rh / 100.0) * 0.2 + (max(0, -lifted_index) / 8.0) * 0.2
        
        # Radar observations correlated with instability
        is_active = np.random.rand() < instability
        
        if is_active:
            reflectivity = float(np.clip(np.random.normal(48, 10), 25, 68))
            velocity = float(np.random.normal(18, 7) * np.random.choice([-1, 1]))
            echo_top_km = float(np.clip(np.random.normal(12, 2.5), 6, 17))
            ir_bt_k = float(np.clip(np.random.normal(215, 12), 195, 245))
            cloud_cooling_rate = float(np.clip(np.random.normal(-12, 5), -28, -2))
            lightning_15m = int(np.clip(np.random.exponential(reflectivity * 1.2), 5, 260))
            rain_rate_mm_hr = float(np.clip(10 ** ((reflectivity - 16) / 16) * 0.1, 2, 95))
        else:
            reflectivity = float(np.clip(np.random.normal(12, 8), 0, 28))
            velocity = float(np.random.normal(5, 3) * np.random.choice([-1, 1]))
            echo_top_km = float(np.clip(np.random.normal(3.5, 1.5), 1, 6))
            ir_bt_k = float(np.clip(np.random.normal(275, 10), 245, 298))
            cloud_cooling_rate = float(np.clip(np.random.normal(-1, 2), -5, 4))
            lightning_15m = int(np.random.choice([0, 1, 2], p=[0.92, 0.06, 0.02]))
            rain_rate_mm_hr = float(np.clip(np.random.exponential(0.4), 0, 5))
            
        lightning_freq_min = float(round(lightning_15m / 15.0, 2))
        
        # Ground truth labels based on physical storm evolution
        prob_30 = float(np.clip(0.45 * (reflectivity / 60.0) + 0.25 * (lightning_15m / 80.0) + 0.20 * instability + 0.10 * (max(0, -cloud_cooling_rate) / 20.0), 0.02, 0.99))
        prob_60 = float(np.clip(prob_30 * np.random.uniform(0.75, 1.15), 0.01, 0.98))
        prob_120 = float(np.clip(prob_60 * np.random.uniform(0.60, 1.10), 0.01, 0.95))
        
        target_30 = 1 if prob_30 > 0.50 else 0
        target_60 = 1 if prob_60 > 0.50 else 0
        target_120 = 1 if prob_120 > 0.50 else 0
        
        if prob_30 < 0.25:
            risk_level = "LOW"
        elif prob_30 < 0.55:
            risk_level = "MODERATE"
        elif prob_30 < 0.80:
            risk_level = "HIGH"
        else:
            risk_level = "SEVERE"
            
        records.append({
            "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S"),
            "location": loc["name"],
            "latitude": loc["lat"],
            "longitude": loc["lon"],
            "radar_reflectivity_dbz": round(reflectivity, 2),
            "radar_velocity_mps": round(velocity, 2),
            "radar_echo_top_km": round(echo_top_km, 2),
            "satellite_ir_temp_k": round(ir_bt_k, 2),
            "cloud_cooling_rate_k_hr": round(cloud_cooling_rate, 2),
            "lightning_strikes_15m": lightning_15m,
            "lightning_frequency_min": lightning_freq_min,
            "nwp_cape_j_kg": round(cape, 1),
            "nwp_cin_j_kg": round(cin, 1),
            "nwp_shear_0_6km_mps": round(shear, 2),
            "nwp_lifted_index": round(lifted_index, 2),
            "nwp_k_index": round(k_index, 2),
            "precipitable_water_mm": round(pw_mm, 2),
            "surface_temp_c": round(temp_c, 2),
            "surface_dew_point_c": round(dew_point_c, 2),
            "relative_humidity_pct": round(rh, 1),
            "surface_pressure_hpa": round(pressure_hpa, 1),
            "rain_rate_mm_hr": round(rain_rate_mm_hr, 2),
            "target_thunderstorm_30m": target_30,
            "target_thunderstorm_60m": target_60,
            "target_thunderstorm_120m": target_120,
            "thunderstorm_prob_30m": round(prob_30, 3),
            "thunderstorm_prob_60m": round(prob_60, 3),
            "thunderstorm_prob_120m": round(prob_120, 3),
            "risk_level": risk_level,
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data", "demo")
    os.makedirs(out_dir, exist_ok=True)
    df = generate_meteorological_dataset(n_samples=4000)
    csv_path = os.path.join(out_dir, "synthetic_meteorological_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated {len(df)} samples saved to: {csv_path}")
