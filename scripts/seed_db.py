import sys
from pathlib import Path

# Add backend to sys.path
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.models import (
    User, UserRole, RoadSegment, PotholeDetection, SeverityLevel,
    DetectionStatus, MaintenanceRequest, MaintenancePriority, MaintenanceStatus,
    MediaUpload, MediaType, JobStatus, Notification, NotificationType
)

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("[+] Seeding PathGuardian database...")

        # 1. Users
        users_data = [
            ("admin@pathguardian.org", "admin123", "Chief System Admin", UserRole.ADMIN),
            ("authority@pathguardian.org", "authority123", "Director Jane (DOT Authority)", UserRole.AUTHORITY),
            ("inspector@pathguardian.org", "inspector123", "Alex Inspector (Road Inspector)", UserRole.INSPECTOR),
            ("worker@pathguardian.org", "worker123", "Sam Repairs (Maintenance Tech)", UserRole.WORKER),
            ("citizen@pathguardian.org", "citizen123", "Chris Citizen", UserRole.CITIZEN),
        ]

        seeded_users = {}
        for email, password, name, role in users_data:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                u = User(
                    email=email,
                    hashed_password=get_password_hash(password),
                    full_name=name,
                    role=role,
                    is_active=True
                )
                db.add(u)
                db.commit()
                db.refresh(u)
                seeded_users[role] = u
                print(f" Created user: {email} [{role.value}]")
            else:
                seeded_users[role] = existing
                print(f" User already exists: {email}")

        # 2. Sample Road Segments
        segments_data = [
            ("Highway A1 Northbound", "HWY-A1-N", 37.7749, -122.4194, 37.7849, -122.4094, 2.5, 78.5),
            ("Main Street Corridor", "STR-MAIN-C", 37.7649, -122.4294, 37.7700, -122.4200, 1.2, 54.0),
            ("Bay Bridge Connector", "CONN-BAY-1", 37.7900, -122.3900, 37.7980, -122.3750, 3.8, 92.0),
            ("Industrial Blvd West", "IND-BLVD-W", 37.7500, -122.4400, 37.7580, -122.4300, 1.8, 41.5),
        ]

        seeded_segments = []
        for name, code, slat, slng, elat, elng, length, health in segments_data:
            existing = db.query(RoadSegment).filter(RoadSegment.code == code).first()
            if not existing:
                rs = RoadSegment(
                    name=name,
                    code=code,
                    start_lat=slat,
                    start_lng=slng,
                    end_lat=elat,
                    end_lng=elng,
                    length_km=length,
                    health_score=health,
                    total_potholes=0
                )
                db.add(rs)
                db.commit()
                db.refresh(rs)
                seeded_segments.append(rs)
                print(f" Created road segment: {name} ({code})")
            else:
                seeded_segments.append(existing)

        # 3. Sample Media Upload
        existing_media = db.query(MediaUpload).first()
        if not existing_media:
            media = MediaUpload(
                user_id=seeded_users[UserRole.INSPECTOR].id,
                filename="sample_road_01.jpg",
                original_name="sample_road_01.jpg",
                media_type=MediaType.IMAGE,
                file_path="./uploads/sample_road_01.jpg",
                file_size=102400,
                mime_type="image/jpeg",
                status=JobStatus.COMPLETED
            )
            db.add(media)
            db.commit()
            db.refresh(media)
        else:
            media = existing_media

        # 4. Sample Detections
        sample_detections = [
            (0.92, SeverityLevel.CRITICAL, 37.7765, -122.4178, DetectionStatus.VERIFIED, "Deep asphalt depression hazard on right lane"),
            (0.85, SeverityLevel.HIGH, 37.7672, -122.4251, DetectionStatus.VERIFIED, "Multiple cracking potholes near crosswalk"),
            (0.76, SeverityLevel.MEDIUM, 37.7521, -122.4350, DetectionStatus.UNVERIFIED, "Moderate pothole forming after heavy rain"),
            (0.94, SeverityLevel.CRITICAL, 37.7540, -122.4320, DetectionStatus.IN_MAINTENANCE, "Severe hazard requiring emergency patching"),
            (0.88, SeverityLevel.LOW, 37.7920, -122.3850, DetectionStatus.RESOLVED, "Surface pothole patched and verified"),
        ]

        for conf, sev, lat, lng, stat, note in sample_detections:
            existing_det = db.query(PotholeDetection).filter(PotholeDetection.latitude == lat, PotholeDetection.longitude == lng).first()
            if not existing_det:
                det = PotholeDetection(
                    media_id=media.id,
                    segment_id=seeded_segments[0].id if lat > 37.77 else seeded_segments[1].id,
                    confidence=conf,
                    severity=sev,
                    bbox={"x": 120, "y": 240, "w": 85, "h": 60},
                    latitude=lat,
                    longitude=lng,
                    altitude=15.0,
                    speed_kmh=42.5,
                    ocr_timestamp="2026-10-10 14:32:10 UTC",
                    status=stat,
                    notes=note
                )
                db.add(det)
                db.commit()
                db.refresh(det)
                print(f" Created detection: Lat {lat}, Lng {lng} [{sev.value}]")

                # 5. Create Maintenance Request for IN_MAINTENANCE or VERIFIED
                if stat in [DetectionStatus.VERIFIED, DetectionStatus.IN_MAINTENANCE]:
                    req = MaintenanceRequest(
                        detection_id=det.id,
                        assigned_worker_id=seeded_users[UserRole.WORKER].id,
                        priority=MaintenancePriority.HIGH if sev == SeverityLevel.CRITICAL else MaintenancePriority.MEDIUM,
                        status=MaintenanceStatus.IN_PROGRESS if stat == DetectionStatus.IN_MAINTENANCE else MaintenanceStatus.ASSIGNED,
                        notes="Dispatched repair team with asphalt cold patch."
                    )
                    db.add(req)
                    db.commit()

        # 6. Notifications
        admin_user = seeded_users[UserRole.ADMIN]
        existing_notif = db.query(Notification).filter(Notification.user_id == admin_user.id).first()
        if not existing_notif:
            notif = Notification(
                user_id=admin_user.id,
                title="Critical Pothole Hazard Detected",
                message="A critical severity pothole was detected on Highway A1 Northbound (Lat: 37.7765, Lng: -122.4178).",
                type=NotificationType.HAZARD_ALERT,
                is_read=False
            )
            db.add(notif)
            db.commit()

        print("[OK] Database seeding complete!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
