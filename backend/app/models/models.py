import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Enum as SQLEnum,
    ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    AUTHORITY = "AUTHORITY"
    INSPECTOR = "INSPECTOR"
    WORKER = "WORKER"
    CITIZEN = "CITIZEN"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.CITIZEN, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    media_uploads = relationship("MediaUpload", back_populates="user", cascade="all, delete-orphan")
    assigned_maintenance = relationship("MaintenanceRequest", back_populates="assigned_worker", foreign_keys="MaintenanceRequest.assigned_worker_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class MediaType(str, enum.Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"

class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class MediaUpload(Base):
    __tablename__ = "media_uploads"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    filename = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    media_type = Column(SQLEnum(MediaType), nullable=False)
    file_path = Column(String, nullable=False)
    annotated_path = Column(String, nullable=True)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING, nullable=False)
    error_message = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="media_uploads")
    detections = relationship("PotholeDetection", back_populates="media", cascade="all, delete-orphan")
    processing_jobs = relationship("ProcessingJob", back_populates="media", cascade="all, delete-orphan")

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    media_id = Column(String, ForeignKey("media_uploads.id"), nullable=False)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING, nullable=False)
    progress = Column(Float, default=0.0)
    total_frames = Column(Integer, default=0)
    processed_frames = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    media = relationship("MediaUpload", back_populates="processing_jobs")

class SeverityLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class DetectionStatus(str, enum.Enum):
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    IN_MAINTENANCE = "IN_MAINTENANCE"
    RESOLVED = "RESOLVED"

class PotholeDetection(Base):
    __tablename__ = "pothole_detections"

    id = Column(String, primary_key=True, default=generate_uuid)
    media_id = Column(String, ForeignKey("media_uploads.id"), nullable=False)
    segment_id = Column(String, ForeignKey("road_segments.id"), nullable=True)
    frame_number = Column(Integer, nullable=True)
    confidence = Column(Float, nullable=False)
    severity = Column(SQLEnum(SeverityLevel), default=SeverityLevel.MEDIUM, nullable=False)
    bbox = Column(JSON, nullable=False)  # {"x": min_x, "y": min_y, "w": w, "h": h}
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    altitude = Column(Float, nullable=True)
    speed_kmh = Column(Float, nullable=True)
    ocr_timestamp = Column(String, nullable=True)
    detected_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(SQLEnum(DetectionStatus), default=DetectionStatus.UNVERIFIED, nullable=False)
    notes = Column(Text, nullable=True)

    media = relationship("MediaUpload", back_populates="detections")
    segment = relationship("RoadSegment", back_populates="detections")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="detection", cascade="all, delete-orphan")

class RoadSegment(Base):
    __tablename__ = "road_segments"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    start_lat = Column(Float, nullable=False)
    start_lng = Column(Float, nullable=False)
    end_lat = Column(Float, nullable=False)
    end_lng = Column(Float, nullable=False)
    length_km = Column(Float, default=1.0)
    health_score = Column(Float, default=100.0) # 0 to 100
    total_potholes = Column(Integer, default=0)
    last_assessed = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    detections = relationship("PotholeDetection", back_populates="segment")

class GPSTrack(Base):
    __tablename__ = "gps_tracks"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # "GPX" or "CSV"
    total_samples = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    samples = relationship("GPSSample", back_populates="track", cascade="all, delete-orphan")

class GPSSample(Base):
    __tablename__ = "gps_samples"

    id = Column(String, primary_key=True, default=generate_uuid)
    track_id = Column(String, ForeignKey("gps_tracks.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    altitude = Column(Float, nullable=True)
    speed_kmh = Column(Float, nullable=True)
    timestamp = Column(DateTime, nullable=False)

    track = relationship("GPSTrack", back_populates="samples")

class MaintenancePriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"

class MaintenanceStatus(str, enum.Enum):
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    WORK_COMPLETED = "WORK_COMPLETED"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    detection_id = Column(String, ForeignKey("pothole_detections.id"), nullable=False)
    assigned_worker_id = Column(String, ForeignKey("users.id"), nullable=True)
    priority = Column(SQLEnum(MaintenancePriority), default=MaintenancePriority.MEDIUM, nullable=False)
    status = Column(SQLEnum(MaintenanceStatus), default=MaintenanceStatus.ASSIGNED, nullable=False)
    notes = Column(Text, nullable=True)
    before_photo = Column(String, nullable=True)
    after_photo = Column(String, nullable=True)
    scheduled_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    detection = relationship("PotholeDetection", back_populates="maintenance_requests")
    assigned_worker = relationship("User", back_populates="assigned_maintenance", foreign_keys=[assigned_worker_id])
    history = relationship("RepairHistory", back_populates="request", cascade="all, delete-orphan")

class RepairHistory(Base):
    __tablename__ = "repair_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("maintenance_requests.id"), nullable=False)
    previous_status = Column(String, nullable=False)
    new_status = Column(String, nullable=False)
    comment = Column(Text, nullable=True)
    changed_by_user_id = Column(String, ForeignKey("users.id"), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    request = relationship("MaintenanceRequest", back_populates="history")

class NotificationType(str, enum.Enum):
    HAZARD_ALERT = "HAZARD_ALERT"
    MAINTENANCE_ASSIGNED = "MAINTENANCE_ASSIGNED"
    REPAIR_UPDATED = "REPAIR_UPDATED"
    SYSTEM_INFO = "SYSTEM_INFO"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(SQLEnum(NotificationType), default=NotificationType.SYSTEM_INFO, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
