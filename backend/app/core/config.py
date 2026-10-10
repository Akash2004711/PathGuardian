import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PathGuardian"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "pathguardian_super_secret_jwt_key_change_in_production_32bytes_min!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite:///./pathguardian.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Media & Uploads
    UPLOAD_DIR: str = "./uploads"
    YOLO_MODEL_PATH: str = "../ml/weights/yolov8n-pothole.pt"
    YOLO_CONFIDENCE_THRESHOLD: float = 0.25

    # SMTP Notifications
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@pathguardian.org"
    EMAILS_FROM_NAME: str = "PathGuardian Alerts"

    # Optional Google Maps
    GOOGLE_MAPS_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
