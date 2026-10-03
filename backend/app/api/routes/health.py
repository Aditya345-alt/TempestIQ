from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "operational",
        "service": "TEMPESTIQ Weather Intelligence & Nowcasting API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "providers": {
            "radar": "available",
            "satellite": "available",
            "lightning": "available",
            "nwp": "available",
            "ml_inference": "operational"
        }
    }
