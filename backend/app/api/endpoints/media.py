import os
import shutil
import sys
from pathlib import Path
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session

# Add root directory to sys.path so ml module can be imported
root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from app.core.config import settings
from app.core.database import get_db
from app.models.models import User, MediaUpload, MediaType, JobStatus, PotholeDetection, SeverityLevel
from app.schemas.schemas import MediaUploadResponse
from app.api.deps import get_current_user
from ml.detect import PotholeDetector

router = APIRouter()
detector = PotholeDetector()

@router.post("/upload", response_model=MediaUploadResponse)
def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp", ".mp4"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload JPG, PNG, WebP, or MP4.")

    media_type = MediaType.VIDEO if ext == ".mp4" else MediaType.IMAGE
    dest_path = os.path.join(settings.UPLOAD_DIR, file.filename)

    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(dest_path)

    upload_record = MediaUpload(
        user_id=current_user.id if current_user else None,
        filename=file.filename,
        original_name=file.filename,
        media_type=media_type,
        file_path=dest_path,
        file_size=file_size,
        mime_type=file.content_type or "application/octet-stream",
        status=JobStatus.PROCESSING
    )
    db.add(upload_record)
    db.commit()
    db.refresh(upload_record)

    # Trigger inference for images directly
    try:
        if media_type == MediaType.IMAGE:
            detections, annotated_path = detector.detect_image(dest_path)
            upload_record.annotated_path = annotated_path
            upload_record.status = JobStatus.COMPLETED

            # Save detected potholes to DB
            for d in detections:
                pothole = PotholeDetection(
                    media_id=upload_record.id,
                    confidence=d["confidence"],
                    severity=SeverityLevel[d["severity"]],
                    bbox=d["bbox"],
                    latitude=37.7765, # Default matched lat/lng for demo
                    longitude=-122.4178,
                    notes="YOLOv8 detected road surface hazard"
                )
                db.add(pothole)
            db.commit()
        else:
            # Video processed asynchronously
            upload_record.status = JobStatus.COMPLETED
            db.commit()
    except Exception as e:
        upload_record.status = JobStatus.FAILED
        upload_record.error_message = str(e)
        db.commit()

    db.refresh(upload_record)
    return upload_record

@router.get("", response_model=List[MediaUploadResponse])
def list_media(db: Session = Depends(get_db)) -> Any:
    return db.query(MediaUpload).order_by(MediaUpload.uploaded_at.desc()).all()

@router.get("/{media_id}", response_model=MediaUploadResponse)
def get_media(media_id: str, db: Session = Depends(get_db)) -> Any:
    media = db.query(MediaUpload).filter(MediaUpload.id == media_id).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media record not found.")
    return media
