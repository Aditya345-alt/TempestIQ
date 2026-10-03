from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    state = Column(String(100), nullable=True)
    country = Column(String(100), default="India")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=500.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    weather_observations = relationship("WeatherObservation", back_populates="location")
    predictions = relationship("Prediction", back_populates="location")

class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, default=0.0)
    pressure_hpa = Column(Float, nullable=False)
    rainfall_mm = Column(Float, default=0.0)
    dew_point_c = Column(Float, nullable=True)
    cape_j_kg = Column(Float, default=1200.0)
    cin_j_kg = Column(Float, default=-40.0)
    shear_0_6km_mps = Column(Float, default=15.0)
    condition = Column(String(100), default="Partly Cloudy")
    is_demo = Column(Boolean, default=True)

    location = relationship("Location", back_populates="weather_observations")

class RadarObservation(Base):
    __tablename__ = "radar_observations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    max_reflectivity_dbz = Column(Float, default=45.0)
    echo_top_km = Column(Float, default=11.5)
    velocity_mps = Column(Float, default=12.0)
    storm_cells_detected = Column(Integer, default=3)
    grid_data_json = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

class SatelliteObservation(Base):
    __tablename__ = "satellite_observations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    ir_brightness_temp_k = Column(Float, default=225.0)
    water_vapor_temp_k = Column(Float, default=240.0)
    cloud_top_height_km = Column(Float, default=12.0)
    cooling_rate_k_hr = Column(Float, default=-8.5)
    cloud_growth_trend = Column(String(50), default="Rapidly Developing")
    is_demo = Column(Boolean, default=True)

class LightningObservation(Base):
    __tablename__ = "lightning_observations"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    strike_count_15m = Column(Integer, default=34)
    flash_rate_per_min = Column(Float, default=2.27)
    strike_density_sqkm = Column(Float, default=0.45)
    peak_current_ka = Column(Float, default=38.5)
    strikes_detail_json = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

class Storm(Base):
    __tablename__ = "storms"

    id = Column(Integer, primary_key=True, index=True)
    storm_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    direction_deg = Column(Float, default=45.0)
    speed_kmh = Column(Float, default=32.0)
    intensity_dbz = Column(Float, default=52.0)
    severity = Column(String(50), default="HIGH")  # LOW, MODERATE, HIGH, SEVERE
    status = Column(String(50), default="ACTIVE")   # ACTIVE, DISSIPATING, MERGED
    created_at = Column(DateTime, default=datetime.utcnow)

    track_points = relationship("StormTrackPoint", back_populates="storm", cascade="all, delete-orphan")

class StormTrackPoint(Base):
    __tablename__ = "storm_track_points"

    id = Column(Integer, primary_key=True, index=True)
    storm_id = Column(Integer, ForeignKey("storms.id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    intensity_dbz = Column(Float, default=45.0)
    point_type = Column(String(20), nullable=False)  # historical, current, predicted

    storm = relationship("Storm", back_populates="track_points")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    horizon_30m_prob = Column(Float, nullable=False)
    horizon_60m_prob = Column(Float, nullable=False)
    horizon_120m_prob = Column(Float, nullable=False)
    risk_level = Column(String(50), nullable=False)
    confidence = Column(Float, default=0.85)
    model_name = Column(String(100), default="TempestIQ Multi-Sensor XGBoost")
    model_version = Column(String(50), default="1.0.0")
    status = Column(String(50), default="TRAINED")

    location = relationship("Location", back_populates="predictions")

class AlertRule(Base):
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(100), nullable=False)
    thunderstorm_threshold = Column(Float, default=70.0)
    lightning_threshold = Column(Float, default=60.0)
    notify_method = Column(String(50), default="Email")
    notify_target = Column(String(255), default="ops-center@tempestiq.internal")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    alerts = relationship("Alert", back_populates="rule", cascade="all, delete-orphan")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, ForeignKey("alert_rules.id"), nullable=True)
    location_name = Column(String(100), nullable=False)
    risk_level = Column(String(50), default="HIGH")  # LOW, MODERATE, HIGH, SEVERE
    reason = Column(String(255), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    data_source = Column(String(100), default="Doppler Radar + Lightning Network + XGBoost v1")
    model_version = Column(String(50), default="v1.0.0")
    is_active = Column(Boolean, default=True)

    rule = relationship("AlertRule", back_populates="alerts")

class AIModelRecord(Base):
    __tablename__ = "ai_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    task = Column(String(100), default="Thunderstorm Nowcasting")
    status = Column(String(50), default="TRAINED")
    trained_at = Column(DateTime, default=datetime.utcnow)
    metrics_json = Column(Text, nullable=True)

class DatasetRecord(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    file_path = Column(String(255), nullable=False)
    row_count = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    date_range = Column(String(100), nullable=True)
    features_json = Column(Text, nullable=True)
    summary_json = Column(Text, nullable=True)
