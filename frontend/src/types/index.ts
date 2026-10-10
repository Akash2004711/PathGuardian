export type UserRole = 'ADMIN' | 'AUTHORITY' | 'INSPECTOR' | 'WORKER' | 'CITIZEN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type MediaType = 'IMAGE' | 'VIDEO';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface MediaUpload {
  id: string;
  user_id?: string;
  filename: string;
  original_name: string;
  media_type: MediaType;
  file_path: string;
  annotated_path?: string;
  file_size: number;
  mime_type: string;
  status: JobStatus;
  uploaded_at: string;
}

export interface ProcessingJob {
  id: string;
  media_id: string;
  status: JobStatus;
  progress: number;
  total_frames: number;
  processed_frames: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DetectionStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED' | 'IN_MAINTENANCE' | 'RESOLVED';

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PotholeDetection {
  id: string;
  media_id: string;
  segment_id?: string;
  frame_number?: number;
  confidence: number;
  severity: SeverityLevel;
  bbox: BoundingBox;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  speed_kmh?: number;
  ocr_timestamp?: string;
  detected_timestamp: string;
  status: DetectionStatus;
  notes?: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  code: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  length_km: number;
  health_score: number;
  total_potholes: number;
  last_assessed: string;
}

export interface GPSSample {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed_kmh?: number;
  timestamp: string;
}

export interface GPSTrack {
  id: string;
  name: string;
  file_type: string;
  total_samples: number;
  uploaded_at: string;
  samples?: GPSSample[];
}

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MaintenanceStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'WORK_COMPLETED' | 'REJECTED' | 'CLOSED';

export interface RepairHistory {
  id: string;
  request_id: string;
  previous_status: string;
  new_status: string;
  comment?: string;
  changed_by_user_id?: string;
  timestamp: string;
}

export interface MaintenanceRequest {
  id: string;
  detection_id: string;
  assigned_worker_id?: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  notes?: string;
  before_photo?: string;
  after_photo?: string;
  scheduled_date?: string;
  completed_at?: string;
  created_at: string;
  detection?: PotholeDetection;
  history?: RepairHistory[];
}

export type NotificationType = 'HAZARD_ALERT' | 'MAINTENANCE_ASSIGNED' | 'REPAIR_UPDATED' | 'SYSTEM_INFO';

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface DashboardMetrics {
  total_potholes: number;
  verified_potholes: number;
  pending_verification: number;
  critical_hazards: number;
  roads_requiring_maintenance: number;
  open_maintenance_tasks: number;
  completed_repairs: number;
  avg_confidence: number;
  recent_jobs_count: number;
  road_health_avg: number;
  severity_distribution: Record<string, number>;
  monthly_trends: Array<{ month: string; detections: number; repairs: number }>;
}
