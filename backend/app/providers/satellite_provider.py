from datetime import datetime, timedelta
from typing import Dict, Any, List

class SatelliteDataProvider:
    def __init__(self):
        pass

    def get_satellite_observations(self, lat: float, lon: float, region_name: str) -> Dict[str, Any]:
        now = datetime.utcnow()
        bands = [
            {
                "band_name": "Visible (VIS)",
                "wavelength_um": 0.65,
                "min_val": 0.0,
                "max_val": 100.0,
                "units": "% Albedo",
                "description": "High-resolution cloud boundary texture and convective overshooting tops."
            },
            {
                "band_name": "Thermal Infrared (TIR-1)",
                "wavelength_um": 10.8,
                "min_val": 180.0,
                "max_val": 320.0,
                "units": "Kelvin (K)",
                "description": "Cloud-top brightness temperature; colder tops (sub-210K) denote intense deep convective cores."
            },
            {
                "band_name": "Water Vapor (WV)",
                "wavelength_um": 6.7,
                "min_val": 200.0,
                "max_val": 270.0,
                "units": "Kelvin (K)",
                "description": "Mid-to-upper tropospheric moisture flux, dry slots, and vorticity advection."
            },
        ]
        
        frames = []
        for offset in [-60, -45, -30, -15, 0]:
            t = now + timedelta(minutes=offset)
            # Progressive cooling as convective cloud shoots upward
            cooling = -10.5 - (offset / 10.0)
            ir_temp = 212.0 + (offset * 0.25)
            wv_temp = 232.0 + (offset * 0.15)
            cloud_top_km = 14.2 - (offset * 0.04)
            
            frames.append({
                "timestamp": t.strftime("%H:%M UTC"),
                "time_offset_min": offset,
                "ir_brightness_temp_k": round(ir_temp, 1),
                "water_vapor_temp_k": round(wv_temp, 1),
                "cloud_top_height_km": round(cloud_top_km, 1),
                "cooling_rate_k_hr": round(cooling, 1),
                "cloud_growth_trend": "Overshooting Top Detected" if ir_temp < 210 else "Rapid Vertical Growth"
            })
            
        current = frames[-1]
        
        return {
            "region_name": f"{region_name} Sector Convective Scan",
            "satellite_name": "INSAT-3DR / Multi-Spectral Meteorological Imager",
            "bands": bands,
            "frames": frames,
            "current_metrics": current,
            "data_source": "ISRO / MOSDAC Geo-Stationary Stream (SIMULATED)",
            "is_demo": True,
            "last_updated": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        }

satellite_provider = SatelliteDataProvider()
