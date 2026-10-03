import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "TEMPESTIQ"
    TAGLINE: str = "Predict the Storm. Protect What Matters."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Environment
    ENVIRONMENT: str = "development"
    DEMO_MODE: bool = True
    
    # Security
    SECRET_KEY: str = "tempestiq-super-secret-production-key-change-in-prod"
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    # Database
    DATABASE_URL: str = "sqlite:///./tempestiq.db"
    
    # Data Providers
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    RADAR_API_URL: str = os.getenv("RADAR_API_URL", "")
    SATELLITE_API_URL: str = os.getenv("SATELLITE_API_URL", "")
    LIGHTNING_API_URL: str = os.getenv("LIGHTNING_API_URL", "")
    
    # Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    ML_MODELS_DIR: str = os.path.join(BASE_DIR, "..", "ml", "models")
    DATA_DIR: str = os.path.join(BASE_DIR, "..", "data")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
