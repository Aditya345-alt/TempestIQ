from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..database.models import AlertRule, Alert

class AlertService:
    def __init__(self):
        pass

    def get_alerts_overview(self, db: Session) -> Dict[str, Any]:
        rules = db.query(AlertRule).all()
        active_alerts_db = db.query(Alert).filter(Alert.is_active == True).order_by(Alert.timestamp.desc()).all()
        history_alerts_db = db.query(Alert).filter(Alert.is_active == False).order_by(Alert.timestamp.desc()).limit(20).all()

        active_alerts = [
            {
                "id": a.id,
                "location_name": a.location_name,
                "risk_level": a.risk_level,
                "reason": a.reason,
                "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "data_source": a.data_source,
                "model_version": a.model_version,
                "is_active": a.is_active
            }
            for a in active_alerts_db
        ]

        history_alerts = [
            {
                "id": a.id,
                "location_name": a.location_name,
                "risk_level": a.risk_level,
                "reason": a.reason,
                "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "data_source": a.data_source,
                "model_version": a.model_version,
                "is_active": a.is_active
            }
            for a in history_alerts_db
        ]

        rule_items = [
            {
                "id": r.id,
                "location_name": r.location_name,
                "thunderstorm_threshold": r.thunderstorm_threshold,
                "lightning_threshold": r.lightning_threshold,
                "notify_method": r.notify_method,
                "notify_target": r.notify_target,
                "is_active": r.is_active,
                "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for r in rules
        ]

        return {
            "active_alerts": active_alerts,
            "alert_history": history_alerts,
            "alert_rules": rule_items,
            "safety_notice": "DEMO SAFETY PROTOCOL: Alerts generated here reflect simulated probabilistic calculations or developmental AI nowcasts. They are intended for demonstration and decision support only and must not replace official meteorological agency advisories."
        }

    def create_rule(self, db: Session, location_name: str, ts_threshold: float, ltg_threshold: float, method: str, target: str) -> AlertRule:
        rule = AlertRule(
            location_name=location_name,
            thunderstorm_threshold=ts_threshold,
            lightning_threshold=ltg_threshold,
            notify_method=method,
            notify_target=target,
            is_active=True
        )
        db.add(rule)
        db.commit()
        db.refresh(rule)
        
        # Check if an immediate alert should be triggered for demonstration
        if ts_threshold <= 80.0:
            alert = Alert(
                rule_id=rule.id,
                location_name=location_name,
                risk_level="SEVERE" if ts_threshold >= 75 else "HIGH",
                reason=f"Thunderstorm probability exceeded threshold ({ts_threshold:.0f}%): Severe convective cell detected within 25km radius.",
                data_source="Dual Doppler Radar + XGBoost v1 Nowcast",
                model_version="1.0.0",
                is_active=True
            )
            db.add(alert)
            db.commit()

        return rule

    def delete_rule(self, db: Session, rule_id: int) -> bool:
        rule = db.query(AlertRule).filter(AlertRule.id == rule_id).first()
        if rule:
            db.delete(rule)
            db.commit()
            return True
        return False

alert_service = AlertService()
