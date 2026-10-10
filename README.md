# PathGuardian — AI-Powered Pothole Detection & Geospatial Road Monitoring Platform

**PathGuardian** is an enterprise-grade AI-powered platform for pothole detection, geospatial road monitoring, telemetry matching, and automated maintenance workflow management.

---

## 🌟 Key Features

1. **YOLOv8 AI Computer Vision Engine**: Automated pothole detection from road images and video frames with confidence scores and bounding boxes.
2. **EasyOCR & Telemetry Extraction**: Automatic timestamp and vehicle speed extraction from video burn-in overlays.
3. **GPX & GPS Telemetry Matching**: Timestamp-based spatial interpolation matching bounding box detections with GPX track coordinates.
4. **Interactive Geospatial Map**: Leaflet and OpenStreetMap rendering of geolocated hazard marker pins with severity filtering.
5. **Interactive 3D Road Intelligence**: WebGL procedural asphalt road visualization, moving vehicles, and 3D hazard pins built using Three.js, React Three Fiber, and Drei.
6. **Road Health Index Scoring**: Automated 0 to 100 road condition scoring based on pothole density and severity.
7. **Smart Maintenance Management**: Role-based task assignment, status transitions, repair verification, and audit logging.
8. **In-App Notification Center**: Real-time alerts for critical hazards and maintenance status updates.
9. **Automated Export Engine**: One-click downloading of audit reports in CSV, PDF (ReportLab), and JSON formats.
10. **Role-Based Access Control (RBAC)**: Enforced backend security with 5 roles: Administrator, Government Authority, Road Inspector, Maintenance Worker, Citizen.

---

## 🏗️ Architecture Blueprint

```
PathGuardian/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS + Three.js + Leaflet
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, UI components
│   │   ├── pages/        # 20 full application pages
│   │   ├── three/        # Three.js 3D Road Surface & Hazard Scene
│   │   ├── services/     # Axios API service layer
│   │   ├── context/      # JWT AuthContext provider
│   │   └── types/        # TypeScript interface definitions
│   └── package.json
├── backend/              # Python 3.11 + FastAPI + SQLAlchemy + SQLite/PostGIS
│   ├── app/
│   │   ├── api/          # REST API Endpoints (Health, Auth, Media, Detections, GPS, Roads, Reports, Maintenance)
│   │   ├── core/         # Config, DB Session, Security (Bcrypt & JWT)
│   │   ├── models/       # SQLAlchemy ORM Models
│   │   └── schemas/      # Pydantic Schemas
│   ├── tests/            # Automated Pytest suite
│   └── requirements.txt
├── ml/                   # Ultralytics YOLOv8, OpenCV, EasyOCR, and GPX Matcher
│   ├── detect.py         # Image inference & bounding box drawer
│   ├── video_processor.py# OpenCV frame sampling & annotated video exporter
│   ├── ocr_processor.py  # EasyOCR text extractor
│   └── gps_matcher.py    # GPX/CSV track parser & spatial interpolator
├── data/samples/         # Sample GPX track, CSV telemetry, and sample media
├── scripts/
│   └── seed_db.py        # Database seeder script with demo accounts
└── docker-compose.yml
```

---

## 🚀 Quick Start Guide (Local Windows Environment)

### Prerequisites
- Python 3.11+
- Node.js v18+ / v20+ / v22+
- Git

### 1. Backend Setup & Database Seeding

Open PowerShell terminal in repository root:

```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# (Optional) Install dependencies
python -m pip install -r requirements.txt

# Run Database Seeder (Creates Demo Users & Road Segments)
python ..\scripts\seed_db.py

# Start FastAPI Backend Server (Runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

Open a second PowerShell terminal in repository root:

```powershell
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@pathguardian.org` | `admin123` |
| **Government Authority** | `authority@pathguardian.org` | `authority123` |
| **Road Inspector** | `inspector@pathguardian.org` | `inspector123` |
| **Maintenance Worker** | `worker@pathguardian.org` | `worker123` |
| **Citizen / Viewer** | `citizen@pathguardian.org` | `citizen123` |

---

## 🧪 Automated Testing

```powershell
# Run backend Pytest suite
cd backend
.\.venv\Scripts\pytest -v

# Run frontend build check
cd frontend
npm run build
```

---

## 📄 License
MIT License. Developed for advanced municipal road monitoring and computer vision engineering.
