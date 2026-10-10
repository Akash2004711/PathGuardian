import os
import shutil
import sys
from pathlib import Path
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from app.core.config import settings
from app.core.database import get_db
from app.models.models import GPSTrack, GPSSample, PotholeDetection
from app.schemas.schemas import GPSTrackResponse
from ml.gps_matcher import GPSMatcher

router = APIRouter()

@router.post("/upload-gpx", response_model=GPSTrackResponse)
def upload_gpx(file: UploadFile = File(...), db: Session = Depends(get_db)) -> Any:
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".gpx", ".csv"]:
        raise HTTPException(status_code=400, detail="Only .gpx and .csv files are supported.")

    dest_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if ext == ".gpx":
        samples_data = GPSMatcher.parse_gpx(dest_path)
    else:
        samples_data = GPSMatcher.parse_csv(dest_path)

    track = GPSTrack(
        name=file.filename,
        file_type=ext.replace(".", "").upper(),
        total_samples=len(samples_data)
    )
    db.add(track)
    db.commit()
    db.refresh(track)

    for s in samples_data:
        sample_obj = GPSSample(
            track_id=track.id,
            latitude=s["latitude"],
            longitude=s["longitude"],
            altitude=s.get("altitude"),
            speed_kmh=s.get("speed_kmh"),
            timestamp=s["timestamp"]
        )
        db.add(sample_obj)
    db.commit()

    # Interpolate unpositioned pothole detections
    unpositioned = db.query(PotholeDetection).filter(PotholeDetection.latitude.is_(None)).all()
    for det in unpositioned:
        matched = GPSMatcher.match_detection_to_gpx(det.detected_timestamp, samples_data)
        if matched:
            det.latitude = matched["latitude"]
            det.longitude = matched["longitude"]
            det.altitude = matched.get("altitude")
            det.speed_kmh = matched.get("speed_kmh")
    db.commit()

    db.refresh(track)
    return track

@router.get("/tracks", response_model=List[GPSTrackResponse])
def list_tracks(db: Session = Depends(get_db)) -> Any:
    return db.query(GPSTrack).order_by(GPSTrack.uploaded_at.desc()).all()
