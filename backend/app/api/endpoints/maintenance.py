from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import MaintenanceRequest, MaintenanceStatus, RepairHistory, PotholeDetection, DetectionStatus, User
from app.schemas.schemas import MaintenanceResponse, MaintenanceCreate, MaintenanceUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[MaintenanceResponse])
def list_maintenance_requests(
    status: Optional[MaintenanceStatus] = None,
    db: Session = Depends(get_db)
) -> Any:
    query = db.query(MaintenanceRequest)
    if status:
        query = query.filter(MaintenanceRequest.status == status)
    return query.order_by(MaintenanceRequest.created_at.desc()).all()

@router.post("", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_request(
    req_in: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    det = db.query(PotholeDetection).filter(PotholeDetection.id == req_in.detection_id).first()
    if not det:
        raise HTTPException(status_code=404, detail="Detection not found.")

    req = MaintenanceRequest(
        detection_id=req_in.detection_id,
        assigned_worker_id=req_in.assigned_worker_id,
        priority=req_in.priority,
        status=MaintenanceStatus.ASSIGNED,
        notes=req_in.notes,
        scheduled_date=req_in.scheduled_date
    )
    db.add(req)
    det.status = DetectionStatus.IN_MAINTENANCE
    db.commit()
    db.refresh(req)

    # Log initial repair history
    history = RepairHistory(
        request_id=req.id,
        previous_status="UNASSIGNED",
        new_status=MaintenanceStatus.ASSIGNED.value,
        comment="Maintenance request created",
        changed_by_user_id=current_user.id if current_user else None
    )
    db.add(history)
    db.commit()

    db.refresh(req)
    return req

@router.patch("/{request_id}", response_model=MaintenanceResponse)
def update_maintenance_status(
    request_id: str,
    req_in: MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")

    old_status = req.status.value

    if req_in.status:
        req.status = req_in.status
        if req_in.status == MaintenanceStatus.CLOSED:
            req.detection.status = DetectionStatus.RESOLVED
    if req_in.assigned_worker_id:
        req.assigned_worker_id = req_in.assigned_worker_id
    if req_in.notes:
        req.notes = req_in.notes

    history = RepairHistory(
        request_id=req.id,
        previous_status=old_status,
        new_status=req.status.value,
        comment=req_in.notes or f"Updated to {req.status.value}",
        changed_by_user_id=current_user.id if current_user else None
    )
    db.add(history)
    db.commit()
    db.refresh(req)
    return req
