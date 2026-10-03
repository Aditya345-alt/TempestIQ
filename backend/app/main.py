import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.logging import setup_logging, logger
from .database.database import engine, Base, SessionLocal
from .database.models import Location, AlertRule, Alert

# Import routes
from .api.routes import health, weather, radar, satellite, lightning, storms, nowcast, alerts, locations, models, historical, map as map_route, data_status, stream

# Initialize logging
setup_logging()

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI/ML-Based Nowcasting of Thunderstorms and Lightning Using Atmospheric Observations Including Multiple Radars, Satellite, Lightning and Numerical Weather Prediction Model Data.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(map_route.router, prefix=settings.API_V1_STR, tags=["India Map"])
app.include_router(data_status.router, prefix=settings.API_V1_STR, tags=["Data Status"])
app.include_router(stream.router, prefix=settings.API_V1_STR, tags=["Streaming"])
app.include_router(weather.router, prefix=settings.API_V1_STR, tags=["Weather"])
app.include_router(radar.router, prefix=settings.API_V1_STR, tags=["Radar"])
app.include_router(satellite.router, prefix=settings.API_V1_STR, tags=["Satellite"])
app.include_router(lightning.router, prefix=settings.API_V1_STR, tags=["Lightning"])
app.include_router(storms.router, prefix=settings.API_V1_STR, tags=["Storm Tracking"])
app.include_router(nowcast.router, prefix=settings.API_V1_STR, tags=["Nowcasting"])
app.include_router(alerts.router, prefix=settings.API_V1_STR, tags=["Alerts"])
app.include_router(locations.router, prefix=settings.API_V1_STR, tags=["Locations"])
app.include_router(models.router, prefix=settings.API_V1_STR, tags=["AI Models"])
app.include_router(historical.router, prefix=settings.API_V1_STR, tags=["Historical Analytics"])

@app.on_event("startup")
def startup_seed_db():
    logger.info("Initializing TEMPESTIQ database seed data...")
    db = SessionLocal()
    try:
        # Seed default alert rules if none exist
        if db.query(AlertRule).count() == 0:
            default_rules = [
                AlertRule(
                    location_name="Bhopal",
                    thunderstorm_threshold=70.0,
                    lightning_threshold=60.0,
                    notify_method="Email",
                    notify_target="ops-bhopal@tempestiq.internal",
                    is_active=True
                ),
                AlertRule(
                    location_name="Delhi",
                    thunderstorm_threshold=75.0,
                    lightning_threshold=65.0,
                    notify_method="SMS / Webhook",
                    notify_target="+91-9876543210",
                    is_active=True
                ),
                AlertRule(
                    location_name="Kolkata",
                    thunderstorm_threshold=80.0,
                    lightning_threshold=70.0,
                    notify_method="Email",
                    notify_target="radar-division@tempestiq.internal",
                    is_active=True
                ),
            ]
            db.add_all(default_rules)
            db.commit()

            # Seed default alerts
            alerts_data = [
                Alert(
                    location_name="Bhopal",
                    risk_level="SEVERE",
                    reason="Thunderstorm probability exceeded threshold (78%): Deep convective supercell with 58 dBZ echo core approaching within 15 km.",
                    data_source="Dual Doppler Radar + Ground Lightning Network + XGBoost v1",
                    model_version="1.0.0",
                    is_active=True
                ),
                Alert(
                    location_name="Indore",
                    risk_level="HIGH",
                    reason="Lightning flash rate spike detected (2.8/min, 42 strikes in 15min) in Malwa plateau sector.",
                    data_source="Lightning Location Network (LLN)",
                    model_version="1.0.0",
                    is_active=True
                ),
                Alert(
                    location_name="Delhi",
                    risk_level="MODERATE",
                    reason="Convective boundary collision detected across NCR sector; 55% thunderstorm probability.",
                    data_source="Doppler Weather Radar (DWR Palam)",
                    model_version="1.0.0",
                    is_active=False
                ),
            ]
            db.add_all(alerts_data)
            db.commit()
            logger.info("Default alert rules and alerts seeded.")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "Welcome to TEMPESTIQ API",
        "tagline": settings.TAGLINE,
        "docs": "/docs",
        "version": settings.VERSION
    }
