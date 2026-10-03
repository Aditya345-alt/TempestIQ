import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List

class RadarDataProvider:
    def __init__(self):
        pass

    def get_radar_visualization(self, center_lat: float, center_lon: float, station_name: str) -> Dict[str, Any]:
        now = datetime.utcnow()
        frames = []
        
        # 6 frames: -30m, -20m, -10m, 0m (now), +15m (projected), +30m (projected)
        offsets = [
            (-30, "historical"),
            (-20, "historical"),
            (-10, "historical"),
            (0, "current"),
            (15, "projected"),
            (30, "projected"),
        ]
        
        # Storm cell cluster offsets moving northeast (bearing 45 deg)
        base_speed_deg_per_10m = 0.04  # movement per 10 minutes
        
        for offset, f_type in offsets:
            frame_time = now + timedelta(minutes=offset)
            steps = offset / 10.0
            
            # Simulated storm cell centers moving with time
            cell1_lat = center_lat + 0.12 + (steps * base_speed_deg_per_10m)
            cell1_lon = center_lon - 0.15 + (steps * base_speed_deg_per_10m * 1.2)
            
            cell2_lat = center_lat - 0.18 + (steps * base_speed_deg_per_10m * 0.9)
            cell2_lon = center_lon + 0.05 + (steps * base_speed_deg_per_10m * 1.1)

            points = []
            # Generate radial grid points around storm cells
            for cell_lat, cell_lon, base_intensity in [(cell1_lat, cell1_lon, 58.0), (cell2_lat, cell2_lon, 48.0)]:
                # Growth factor based on time
                intensity_mod = (1.0 + 0.05 * steps) if offset <= 15 else (1.1 - 0.08 * (steps - 1.5))
                peak_dbz = min(68.0, base_intensity * intensity_mod)
                
                for r in np.linspace(0.01, 0.18, 7):
                    n_angles = int(max(6, r * 80))
                    for theta in np.linspace(0, 2 * np.pi, n_angles, endpoint=False):
                        p_lat = cell_lat + r * np.cos(theta)
                        p_lon = cell_lon + r * np.sin(theta) * 1.1
                        
                        # Radial decay
                        dbz = peak_dbz * np.exp(-((r / 0.10) ** 2))
                        if dbz > 18.0:
                            vel = 22.0 * np.cos(theta - np.pi/4)  # Doppler velocity signature
                            points.append({
                                "lat": round(float(p_lat), 4),
                                "lon": round(float(p_lon), 4),
                                "reflectivity_dbz": round(float(dbz), 1),
                                "velocity_mps": round(float(vel), 1),
                            })
                            
            frames.append({
                "timestamp": frame_time.strftime("%H:%M:%S UTC"),
                "time_offset_min": offset,
                "frame_type": f_type,
                "max_dbz": round(float(max([p["reflectivity_dbz"] for p in points], default=45.0)), 1),
                "echo_top_km": round(12.5 + (0.3 * steps), 1),
                "points": points[:200]  # Optimize for client rendering
            })
            
        return {
            "station_name": f"{station_name} Doppler Weather Radar (DWR-100)",
            "latitude": center_lat,
            "longitude": center_lon,
            "range_km": 150.0,
            "frames": frames,
            "data_source": "IMD / Doppler Radar Network Architecture (SIMULATED)",
            "status_label": "SIMULATED RADAR DATA",
            "is_simulated": True,
            "last_updated": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        }

radar_provider = RadarDataProvider()
