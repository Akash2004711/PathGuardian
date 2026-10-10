import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_dashboard_metrics_api():
    response = client.get("/api/v1/dashboard/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "total_potholes" in data
    assert "road_health_avg" in data

def test_list_detections_api():
    response = client.get("/api/v1/detections")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_list_road_segments_api():
    response = client.get("/api/v1/roads")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_reports_export_json_api():
    response = client.get("/api/v1/reports/export/json")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "PathGuardian"
