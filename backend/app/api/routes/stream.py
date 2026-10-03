"""
Server-Sent Events (SSE) streaming route for TempestIQ India Intelligence Map.
Streams telemetry pulses for lightning flashes, radar updates, and active storm centroids.
"""
import asyncio
import json
from datetime import datetime, timezone
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ...providers.india_lightning_provider import IndiaLightningProvider
from ...providers.storm_tracking_provider import StormTrackingProvider
from ...providers.data_status_provider import DataStatusProvider

router = APIRouter()
lightning_p = IndiaLightningProvider()
storm_p = StormTrackingProvider()
status_p = DataStatusProvider()

async def event_generator():
    """Generates SSE packets every 3.5 seconds."""
    counter = 0
    while True:
        try:
            now = datetime.now(timezone.utc)
            ltg_data = lightning_p.get_observed_strikes(lookback_minutes=15)
            storms_data = storm_p.get_active_storms()
            
            payload = {
                "sequence": counter,
                "timestamp_utc": now.isoformat(),
                "active_storms_count": storms_data["active_cells_count"],
                "recent_strikes_count": ltg_data["strikes_last_15m"],
                "flash_rate_per_min": ltg_data["flash_rate_per_min"],
                "latest_strike": ltg_data["strikes"][0] if ltg_data["strikes"] else None,
                "status_badge": "LIVE TELEMETRY STREAM"
            }
            
            event_data = f"event: telemetry_pulse\ndata: {json.dumps(payload)}\n\n"
            yield event_data.encode("utf-8")
            
            counter += 1
            await asyncio.sleep(3.5)
        except asyncio.CancelledError:
            break
        except Exception as e:
            err_data = f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"
            yield err_data.encode("utf-8")
            await asyncio.sleep(5.0)

@router.get("/stream")
async def stream_live_telemetry():
    """Server-Sent Events (SSE) stream providing real-time lightning & storm telemetry."""
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
