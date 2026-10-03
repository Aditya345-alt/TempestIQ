from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...services.alert_service import alert_service
from ...schemas.alerts import AlertsOverviewResponse, AlertRuleCreate, AlertRuleResponse

router = APIRouter()

@router.get("/alerts", response_model=AlertsOverviewResponse)
def get_alerts(db: Session = Depends(get_db)):
    return alert_service.get_alerts_overview(db)

@router.post("/alerts", response_model=AlertRuleResponse)
def create_alert_rule(payload: AlertRuleCreate, db: Session = Depends(get_db)):
    rule = alert_service.create_rule(
        db=db,
        location_name=payload.location_name,
        ts_threshold=payload.thunderstorm_threshold,
        ltg_threshold=payload.lightning_threshold,
        method=payload.notify_method,
        target=payload.notify_target
    )
    return AlertRuleResponse(
        id=rule.id,
        location_name=rule.location_name,
        thunderstorm_threshold=rule.thunderstorm_threshold,
        lightning_threshold=rule.lightning_threshold,
        notify_method=rule.notify_method,
        notify_target=rule.notify_target,
        is_active=rule.is_active,
        created_at=rule.created_at.strftime("%Y-%m-%d %H:%M")
    )

@router.delete("/alerts/{id}")
def delete_alert_rule(id: int, db: Session = Depends(get_db)):
    success = alert_service.delete_rule(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert rule not found")
    return {"status": "success", "message": f"Rule {id} removed"}
