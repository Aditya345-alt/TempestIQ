"""
Multi-Radar Data Provider for India Doppler Weather Radar (DWR) Network.
Simulates composite reflectivity scans and radar station networks across India.
"""
import os
import json
import numpy as np
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional

class MultiRadarProvider:
    def __init__(self):
        geo_dir = os.path.join(os.path.dirname(__file__), "..", "data", "geo")
        radar_file = os.path.join(geo_dir, "radar_network.json")
        if os.path.exists(radar_file):
            with open(radar_file, "r", encoding="utf-8") as f:
                self.stations = json.load(f)
        else:
            self.stations = []

    def get_stations(self) -> List[Dict[str, Any]]:
        return self.stations

    def get_station_by_id(self, station_id: str) -> Optional[Dict[str, Any]]:
        for s in self.stations:
            if s["id"].upper() == station_id.upper() or s["station_code"].upper() == station_id.upper():
                return s
        return None

    def get_composite_reflectivity(self, time_offset_min: int = 0) -> Dict[str, Any]:
        """
        Generates India-wide multi-radar composite reflectivity points for a given time offset.
        Active storm regions:
        1. Central India (Bhopal - Jabalpur - Sagar, MP)
        2. East India (Kolkata - Howrah - Bay of Bengal, WB)
        3. North India (Delhi - Meerut - Lucknow, NCR/UP)
        4. Maharashtra (Nagpur - Vidarbha)
        5. Northeast (Guwahati - Shillong)
        """
        now = datetime.now(timezone.utc)
        frame_time = now + timedelta(minutes=time_offset_min)
        step = time_offset_min / 10.0  # movement step factor

        # Convective storm cluster cores [lat, lon, base_dbz, radius_deg, drift_lat, drift_lon, label]
        clusters = [
            # Tropical Cyclone Dana (Bay of Bengal) - Spiral Eyewall & Rainbands
            {"lat": 14.80 + (step * 0.02), "lon": 88.50 - (step * 0.015), "dbz": 64.0, "r": 0.85, "name": "Cyclone Dana Eyewall Core"},
            {"lat": 15.35 + (step * 0.02), "lon": 87.80 - (step * 0.015), "dbz": 54.0, "r": 0.65, "name": "Dana Western Spiral Rainband"},
            {"lat": 14.20 + (step * 0.02), "lon": 89.20 - (step * 0.015), "dbz": 52.0, "r": 0.60, "name": "Dana Eastern Feeder Band"},

            # Severe Cyclonic Storm Asna (Arabian Sea)
            {"lat": 16.50 + (step * 0.015), "lon": 68.20 - (step * 0.02), "dbz": 58.5, "r": 0.70, "name": "Cyclone Asna Deep Vortex"},
            {"lat": 15.80 + (step * 0.015), "lon": 69.10 - (step * 0.02), "dbz": 51.0, "r": 0.55, "name": "Asna Inflow Band"},

            # Central India Squall Line Arc (MP / Maharashtra)
            {"lat": 23.35 + (step * 0.03), "lon": 77.50 + (step * 0.04), "dbz": 62.0, "r": 0.55, "name": "Bhopal-Sehore Severe Bow Echo"},
            {"lat": 23.60 + (step * 0.03), "lon": 76.50 + (step * 0.04), "dbz": 58.0, "r": 0.50, "name": "Shajapur Convective Front"},
            {"lat": 23.20 + (step * 0.035), "lon": 79.90 + (step * 0.03), "dbz": 61.5, "r": 0.52, "name": "Jabalpur Convective Core"},
            {"lat": 23.90 + (step * 0.025), "lon": 78.60 + (step * 0.035), "dbz": 53.0, "r": 0.42, "name": "Sagar Multicell"},
            {"lat": 21.25 + (step * 0.025), "lon": 79.20 + (step * 0.035), "dbz": 55.0, "r": 0.48, "name": "Vidarbha Squall Tail"},

            # Northeast Convection (Assam & Meghalaya)
            {"lat": 25.55 + (step * 0.02), "lon": 91.80 + (step * 0.02), "dbz": 63.0, "r": 0.50, "name": "Meghalaya Orographic Supercell"},
            {"lat": 26.20 + (step * 0.02), "lon": 92.50 + (step * 0.02), "dbz": 57.0, "r": 0.45, "name": "Brahmaputra Valley Squall Line"},

            # Gangetic Plain & Southern Peninsular
            {"lat": 22.70 + (step * 0.04), "lon": 88.45 + (step * 0.02), "dbz": 59.0, "r": 0.50, "name": "Bengal Kalbaishakhi Supercell"},
            {"lat": 26.90 + (step * 0.03), "lon": 80.85 + (step * 0.04), "dbz": 52.0, "r": 0.40, "name": "Lucknow Convective Line"},
            {"lat": 13.15 + (step * 0.015), "lon": 77.65 + (step * 0.02), "dbz": 46.0, "r": 0.35, "name": "Bengaluru Isolated Storm"}
        ]

        points = []
        is_projected = time_offset_min > 0

        for c in clusters:
            base_dbz = c["dbz"]
            # Intensity variation over time
            decay_growth = (1.0 + 0.04 * step) if time_offset_min <= 15 else (1.06 - 0.06 * (step - 1.5))
            peak_dbz = min(68.0, base_dbz * decay_growth)

            # Generate concentric radial points
            r_steps = 6
            for r in np.linspace(0.04, c["r"], r_steps):
                n_angles = int(max(6, r * 35))
                for theta in np.linspace(0, 2 * np.pi, n_angles, endpoint=False):
                    p_lat = c["lat"] + r * np.cos(theta)
                    p_lon = c["lon"] + r * np.sin(theta) * 1.06
                    
                    # Exponential radial decay from center
                    dbz = peak_dbz * np.exp(-((r / (c["r"] * 0.55)) ** 1.8))
                    if dbz >= 22.0:
                        vel = 18.0 * np.cos(theta - np.pi / 4)
                        echo_top = min(16.5, 7.0 + (dbz / 65.0) * 8.5)
                        points.append({
                            "lat": round(float(p_lat), 4),
                            "lon": round(float(p_lon), 4),
                            "reflectivity_dbz": round(float(dbz), 1),
                            "radial_velocity_mps": round(float(vel), 1),
                            "echo_top_km": round(float(echo_top), 1),
                            "cluster_name": c["name"]
                        })

        return {
            "timestamp_utc": frame_time.isoformat(),
            "time_label": frame_time.strftime("%H:%M UTC"),
            "offset_minutes": time_offset_min,
            "is_projected": is_projected,
            "data_source": "IMD_NATIONAL_COMPOSITE_SIMULATED",
            "active_clusters": len(clusters),
            "points_count": len(points),
            "max_reflectivity_dbz": max([p["reflectivity_dbz"] for p in points]) if points else 0.0,
            "points": points
        }

    def get_radar_animation_frames(self) -> List[Dict[str, Any]]:
        """
        Returns 7 sequential radar composite frames:
        -60m, -45m, -30m, -15m, 0m (NOW), +15m (AI projected), +30m (AI projected)
        """
        offsets = [-60, -45, -30, -15, 0, 15, 30]
        frames = []
        for offset in offsets:
            frame = self.get_composite_reflectivity(time_offset_min=offset)
            frames.append(frame)
        return frames
