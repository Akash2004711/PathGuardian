import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_and_login_user():
    unique_email = f"inspector_{uuid.uuid4().hex[:6]}@pathguardian.org"
    user_payload = {
        "email": unique_email,
        "password": "password123",
        "full_name": "Test Inspector",
        "role": "INSPECTOR"
    }
    resp = client.post("/api/v1/auth/register", json=user_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == unique_email
    assert data["role"] == "INSPECTOR"

    login_payload = {
        "email": unique_email,
        "password": "password123"
    }
    login_resp = client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    token_data = login_resp.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == unique_email
    assert me_data["role"] == "INSPECTOR"

def test_admin_users_access():
    login_resp = client.post("/api/v1/auth/login", json={"email": "admin@pathguardian.org", "password": "admin123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    users_resp = client.get("/api/v1/users", headers=headers)
    assert users_resp.status_code == 200
    users = users_resp.json()
    assert len(users) >= 2

def test_citizen_restricted_from_admin_users():
    login_resp = client.post("/api/v1/auth/login", json={"email": "citizen@pathguardian.org", "password": "citizen123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    users_resp = client.get("/api/v1/users", headers=headers)
    assert users_resp.status_code == 403
