"""
Data status route for TempestIQ India Intelligence Map.
Returns source status, station counts, and latency telemetry.
"""
from fastapi import APIRouter
from ...providers.data_status_provider import DataStatusProvider

router = APIRouter()
status_provider = DataStatusProvider()

@router.get("/data-status")
@router.get("/data-status/overview")
def get_data_status():
    """Returns operational integrity, provider sources, station metrics, and latency."""
    return status_provider.get_system_status()
