import sys
from pathlib import Path

# Add backend and workspace root to sys.path
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import pytest
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.models import User, UserRole

@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        users = [
            ("admin@pathguardian.org", "admin123", "Chief System Admin", UserRole.ADMIN),
            ("citizen@pathguardian.org", "citizen123", "Chris Citizen", UserRole.CITIZEN),
        ]
        for email, pwd, name, role in users:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                u = User(
                    email=email,
                    hashed_password=get_password_hash(pwd),
                    full_name=name,
                    role=role,
                    is_active=True
                )
                db.add(u)
        db.commit()
    finally:
        db.close()
