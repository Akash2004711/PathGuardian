from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.models import (
    UserRole, MediaType, JobStatus, SeverityLevel,
    DetectionStatus, MaintenancePriority, MaintenanceStatus, NotificationType
)

# --- Health & Base ---
class HealthResponse(BaseModel):
    status: str = "ok"
    app_name: str = "PathGuardian"
    version: str = "1.0.0"
    database: str = "connected"
    timestamp: datetime

# --- Auth & User ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.CITIZEN

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# --- Media & Processing ---
class MediaUploadResponse(BaseModel):
    id: str
    user_id: Optional[str]
    filename: str
    original_name: str
    media_type: MediaType
    file_path: str
    annotated_path: Optional[str]
    file_size: int
    mime_type: str
    status: JobStatus
    uploaded_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProcessingJobResponse(BaseModel):
    id: str
    media_id: str
    status: JobStatus
    progress: float
    total_frames: int
    processed_frames: int
    error_message: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

# --- Detections ---
class BoundingBox(BaseModel):
    x: float
    y: float
    w: float
    h: float

class DetectionCreate(BaseModel):
    media_id: str
    segment_id: Optional[str] = None
    frame_number: Optional[int] = None
    confidence: float
    severity: SeverityLevel = SeverityLevel.MEDIUM
    bbox: Dict[str, float]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    speed_kmh: Optional[float] = None
    ocr_timestamp: Optional[str] = None
    notes: Optional[str] = None

class DetectionUpdate(BaseModel):
    status: Optional[DetectionStatus] = None
    severity: Optional[SeverityLevel] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    notes: Optional[str] = None

class DetectionResponse(BaseModel):
    id: str
    media_id: str
    segment_id: Optional[str] = None
    frame_number: Optional[int] = None
    confidence: float
    severity: SeverityLevel
    bbox: Dict[str, float]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude: Optional[float] = None
    speed_kmh: Optional[float] = None
    ocr_timestamp: Optional[str] = None
    detected_timestamp: datetime
    status: DetectionStatus
    notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# --- Road Segment ---
class RoadSegmentCreate(BaseModel):
    name: str
    code: str
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    length_km: float = 1.0

class RoadSegmentResponse(BaseModel):
    id: str
    name: str
    code: str
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    length_km: float
    health_score: float
    total_potholes: int
    last_assessed: datetime
    model_config = ConfigDict(from_attributes=True)

# --- GPS Telemetry ---
class GPSSampleSchema(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None
    speed_kmh: Optional[float] = None
    timestamp: datetime

class GPSTrackResponse(BaseModel):
    id: str
    name: str
    file_type: str
    total_samples: int
    uploaded_at: datetime
    samples: Optional[List[GPSSampleSchema]] = None
    model_config = ConfigDict(from_attributes=True)

# --- Maintenance ---
class MaintenanceCreate(BaseModel):
    detection_id: str
    assigned_worker_id: Optional[str] = None
    priority: MaintenancePriority = MaintenancePriority.MEDIUM
    notes: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class MaintenanceUpdate(BaseModel):
    status: Optional[MaintenanceStatus] = None
    assigned_worker_id: Optional[str] = None
    priority: Optional[MaintenancePriority] = None
    notes: Optional[str] = None
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
    completed_at: Optional[datetime] = None

class RepairHistoryResponse(BaseModel):
    id: str
    request_id: str
    previous_status: str
    new_status: str
    comment: Optional[str] = None
    changed_by_user_id: Optional[str] = None
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class MaintenanceResponse(BaseModel):
    id: str
    detection_id: str
    assigned_worker_id: Optional[str] = None
    priority: MaintenancePriority
    status: MaintenanceStatus
    notes: Optional[str] = None
    before_photo: Optional[str] = None
    after_photo: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    detection: Optional[DetectionResponse] = None
    history: List[RepairHistoryResponse] = []
    model_config = ConfigDict(from_attributes=True)

# --- Notifications ---
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: NotificationType
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Dashboard & Analytics ---
class DashboardMetrics(BaseModel):
    total_potholes: int
    verified_potholes: int
    pending_verification: int
    critical_hazards: int
    roads_requiring_maintenance: int
    open_maintenance_tasks: int
    completed_repairs: int
    avg_confidence: float
    recent_jobs_count: int
    road_health_avg: float
    severity_distribution: Dict[str, int]
    monthly_trends: List[Dict[str, Any]]
