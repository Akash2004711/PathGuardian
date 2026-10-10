from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import PotholeDetection, DetectionStatus, SeverityLevel
from app.schemas.schemas import DetectionResponse, DetectionUpdate, DetectionCreate
from app.api.deps import require_inspector

router = APIRouter()

@router.get("", response_model=List[DetectionResponse])
def list_detections(
    status: Optional[DetectionStatus] = None,
    severity: Optional[SeverityLevel] = None,
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(PotholeDetection)
    if status:
        query = query.filter(PotholeDetection.status == status)
    if severity:
        query = query.filter(PotholeDetection.severity == severity)
    return query.order_by(PotholeDetection.detected_timestamp.desc()).all()

@router.get("/{detection_id}", response_model=DetectionResponse)
def get_detection(detection_id: str, db: Session = Depends(get_db)) -> Any:
    det = db.query(PotholeDetection).filter(PotholeDetection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found.")
    return det

@router.patch("/{detection_id}", response_model=DetectionResponse)
def update_detection(
    detection_id: str,
    update_in: DetectionUpdate,
    db: Session = Depends(get_db)
) -> Any:
    det = db.query(PotholeDetection).filter(PotholeDetection.id == detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found.")

    if update_in.status is not None:
        det.status = update_in.status
    if update_in.severity is not None:
        det.severity = update_in.severity
    if update_in.latitude is not None:
        det.latitude = update_in.latitude
    if update_in.longitude is not None:
        det.longitude = update_in.longitude
    if update_in.notes is not None:
        det.notes = update_in.notes

    db.commit()
    db.refresh(det)
    return det
