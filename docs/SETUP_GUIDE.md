# PathGuardian — Windows Local Setup & Operations Manual

This document provides exact step-by-step PowerShell commands to configure and run **PathGuardian** on Windows 10/11.

---

## 1. Environment Verification

Check installed language runtimes:

```powershell
python --version
node -v
npm -v
```

---

## 2. Backend Installation

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -r requirements.txt
```

---

## 3. Database Initialization & Seeding

```powershell
.\.venv\Scripts\python scripts/seed_db.py
```

---

## 4. Running Application Servers

### Start FastAPI Backend:
```powershell
cd backend
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```
Open API documentation at: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

### Start React Frontend:
```powershell
cd frontend
npm run dev
```
Open application in browser at: [http://localhost:5173](http://localhost:5173)

---

## 5. Automated Tests

```powershell
# Run Pytest suite
cd backend
.\.venv\Scripts\pytest -v

# Run Frontend Production Build Check
cd frontend
npm run build
```
