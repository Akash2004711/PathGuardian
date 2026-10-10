from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import RoadSegment, PotholeDetection
from app.schemas.schemas import RoadSegmentResponse, RoadSegmentCreate

router = APIRouter()

@router.get("", response_model=List[RoadSegmentResponse])
def list_road_segments(db: Session = Depends(get_db)) -> Any:
    segments = db.query(RoadSegment).all()
    # Compute live health scores
    for seg in segments:
        potholes_count = db.query(PotholeDetection).filter(PotholeDetection.segment_id == seg.id).count()
        seg.total_potholes = potholes_count
        # Health formula: 100 - (potholes_count * 12.5 / length_km)
        deduction = (potholes_count * 12.5) / max(seg.length_km, 0.5)
        seg.health_score = max(0.0, min(100.0, round(100.0 - deduction, 1)))
    db.commit()
    return segments

@router.post("", response_model=RoadSegmentResponse, status_code=status.HTTP_201_CREATED)
def create_road_segment(seg_in: RoadSegmentCreate, db: Session = Depends(get_db)) -> Any:
    existing = db.query(RoadSegment).filter(RoadSegment.code == seg_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Segment code already exists.")

    seg = RoadSegment(
        name=seg_in.name,
        code=seg_in.code,
        start_lat=seg_in.start_lat,
        start_lng=seg_in.start_lng,
        end_lat=seg_in.end_lat,
        end_lng=seg_in.end_lng,
        length_km=seg_in.length_km,
        health_score=100.0,
        total_potholes=0
    )
    db.add(seg)
    db.commit()
    db.refresh(seg)
    return seg
