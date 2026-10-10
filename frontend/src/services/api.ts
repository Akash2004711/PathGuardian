import axios from 'axios';
import {
  User, UserRole, MediaUpload, PotholeDetection,
  RoadSegment, GPSTrack, MaintenanceRequest,
  NotificationItem, DashboardMetrics, DetectionStatus, SeverityLevel, MaintenanceStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pathguardian_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pathguardian_token');
      localStorage.removeItem('pathguardian_user');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  register: (data: any) => apiClient.post<{ access_token: string; user: User }>('/auth/register', data),
  login: (data: any) => apiClient.post<{ access_token: string; user: User }>('/auth/login', data),
  getMe: () => apiClient.get<User>('/auth/me'),

  // Users
  listUsers: () => apiClient.get<User[]>('/users'),
  updateUserRole: (userId: string, newRole: UserRole) =>
    apiClient.put<User>(`/users/${userId}/role`, null, { params: { new_role: newRole } }),

  // Media & Detection
  uploadMedia: (formData: FormData) =>
    apiClient.post<MediaUpload>('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listMedia: () => apiClient.get<MediaUpload[]>('/media'),
  getMedia: (id: string) => apiClient.get<MediaUpload>(`/media/${id}`),

  // Detections
  listDetections: (params?: { status?: DetectionStatus; severity?: SeverityLevel }) =>
    apiClient.get<PotholeDetection[]>('/detections', { params }),
  updateDetection: (id: string, data: Partial<PotholeDetection>) =>
    apiClient.patch<PotholeDetection>(`/detections/${id}`, data),

  // Roads & Health
  listRoadSegments: () => apiClient.get<RoadSegment[]>('/roads'),
  createRoadSegment: (data: Partial<RoadSegment>) => apiClient.post<RoadSegment>('/roads', data),

  // GPS Telemetry
  uploadGPXTrack: (formData: FormData) =>
    apiClient.post<GPSTrack>('/gps/upload-gpx', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listGPSTracks: () => apiClient.get<GPSTrack[]>('/gps/tracks'),

  // Maintenance Management
  listMaintenanceRequests: (status?: MaintenanceStatus) =>
    apiClient.get<MaintenanceRequest[]>('/maintenance', { params: { status } }),
  createMaintenanceRequest: (data: Partial<MaintenanceRequest>) =>
    apiClient.post<MaintenanceRequest>('/maintenance', data),
  updateMaintenanceStatus: (id: string, data: { status: MaintenanceStatus; notes?: string; before_photo?: string; after_photo?: string }) =>
    apiClient.patch<MaintenanceRequest>(`/maintenance/${id}`, data),

  // Notifications
  listNotifications: () => apiClient.get<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),

  // Analytics & Dashboard
  getDashboardMetrics: () => apiClient.get<DashboardMetrics>('/dashboard/metrics'),

  // Reports
  exportReportCSV: () => apiClient.get('/reports/export/csv', { responseType: 'blob' }),
  exportReportPDF: () => apiClient.get('/reports/export/pdf', { responseType: 'blob' }),
  exportReportJSON: () => apiClient.get('/reports/export/json'),
};
