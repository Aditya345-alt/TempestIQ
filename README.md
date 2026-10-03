# TEMPESTIQ

> **"Predict the Storm. Protect What Matters."**  
> **AI/ML-Based Nowcasting of Thunderstorms and Lightning Using Atmospheric Observations Including Multiple Radars, Satellite, Lightning and Numerical Weather Prediction Model Data.**

---

## 🌩️ Executive Overview

**TempestIQ** is an operational-grade, cinematic meteorological intelligence and convective nowcasting web application. It addresses the critical **0 to 120-minute lead-time gap** where conventional Numerical Weather Prediction (NWP) models fail due to slow operational cycles and coarse resolutions.

By fusing real-time multi-sensor telemetry—including **Dual-Polarization Doppler Weather Radars (DWR)**, **Geostationary Satellite Rapid Scans (INSAT-3DR / GOES)**, **Ground Lightning Location Networks (LLN)**, and **NWP thermodynamic soundings**—TempestIQ computes calibrated probabilistic nowcasts, predicts storm cell advection, and triggers automated multi-channel early warnings.

---

## ✨ Key Capabilities

1. **Cinematic Meteorological Landing Page**:
   - Built on the **OriginKit hero-17** visual foundation with editorial typography, interactive 3D Globe, soft-beam orbiting card borders, and atmospheric gradients.
   - Comprehensive sections detailing multi-sensor tracking, 30/60/120 min probability forecasts, data fusion pipelines, and technology breakdown.

2. **Weather Intelligence Dashboard (`/dashboard`)**:
   - Real-time telemetry: Temperature, Humidity, Wind, Pressure, Rainfall, Thunderstorm Probability, Lightning Risk, and Active Storms.
   - Interactive live composite map and dynamic risk gauge powered by backend models.
   - Evolution timelines for thunderstorm probability, lightning activity, rainfall, and storm intensity.

3. **Live Geospatial Atmospheric Map (`/map`)**:
   - Leaflet-powered dark-theme geospatial mapping with GPS geolocation support.
   - Dynamic layer toggles: **Doppler Radar**, **Satellite IR**, **Lightning Strikes**, **Thunderstorm Risk Contours**, **Rainfall Accumulation**, and **Storm Tracks**.
   - Clear indicators for data source, last updated time, and data status.

4. **Thunderstorm Nowcasting (`/nowcast`)**:
   - Probabilistic nowcasting across **0–30 min**, **30–60 min**, and **60–120 min** horizons with associated risk levels and model confidence scores.
   - Interactive **ML Parameter Tuner** allowing users to adjust CAPE, Radar dBZ, Lightning strikes, and Cloud cooling rate to run instant real-time inference via `POST /api/nowcast/predict`.
   - Storm cell lifecycle timeline (Initiation → Mature Convection → Supercell / Bow Echo → Dissipation).

5. **Doppler Radar Analysis (`/radar`)**:
   - Reflectivity (dBZ) visualization with multi-frame animation controls (-30m, -20m, -10m, Current 0m, +15m projected, +30m projected).
   - Standard meteorological color scales from light rain (&lt;25 dBZ) to severe hail (&gt;60 dBZ).
   - Labeled as **SIMULATED RADAR DATA** with architecture ready for raw Iris/Nexrad Level-II feeds.

6. **Satellite Remote Sensing (`/satellite`)**:
   - Multi-spectral band toggle: **Visible (0.65 µm)**, **Thermal Infrared (10.8 µm)**, and **Water Vapor (6.7 µm)**.
   - Real-time cloud-top brightness temperature tracking and cooling rates (identifying overshooting tops).

7. **Lightning Detection (`/lightning`)**:
   - Displays observed strikes (Cloud-to-Ground vs Intra-Cloud) and separate **Predicted Lightning Risk** layers.
   - Strike frequency histogram and strict meteorological safety notice differentiating observed strikes from probabilistic risk zones.

8. **Convective Storm Tracking (`/storms`)**:
   - SCIT/TITAN-derived centroid tracking: Storm Code, speed, direction azimuth, intensity, observed path, and predicted trajectory.

9. **Weather Forecast (`/forecast`)**:
   - Comprehensive multi-horizon breakdown: Now, 30m, 60m, 120m, 3h, 6h, 12h, 24h.

10. **Automated Alert Rules (`/alerts`)**:
    - User-configured trigger rules based on thunderstorm or lightning probability thresholds.
    - Active alerts and complete dispatch audit history with severity classification (LOW, MODERATE, HIGH, SEVERE).

11. **Historical Climatological Analytics (`/historical`)**:
    - CSV dataset uploader with preview table and summary stats (row counts, date ranges, missing values).
    - Multi-metric historical trend graphs.

12. **AI Model Verification (`/models`)**:
    - True statistical metrics: **Precision, Recall, F1, ROC-AUC, Brier Score, POD (Probability of Detection), FAR (False Alarm Ratio), and CSI (Critical Success Index)**.
    - Full 2x2 Contingency Table (Confusion Matrix) and interactive ROC Curve.

13. **Hackathon Pitch Presentation Mode (`/presentation`)**:
    - Cinematic slide deck walkthrough ideal for presenting to SIH judges, college faculty, or researchers.

---

## 🏛️ System Architecture

```
nowcasting/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & seed logic
│   │   ├── api/routes/              # REST API endpoints (health, weather, radar, etc.)
│   │   ├── core/                    # Config, security, and logging
│   │   ├── database/                # SQLAlchemy models & SQLite/Postgres engine
│   │   ├── providers/               # Sensor data providers (Open-Meteo & simulated fallbacks)
│   │   ├── schemas/                 # Pydantic request/response validation schemas
│   │   └── services/                # Business logic & nowcasting pipelines
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/              # Navigation, OriginKit hero-17, and common widgets
│   │   ├── context/                 # Location & unit state management
│   │   ├── hooks/                   # Custom data-fetching hooks
│   │   ├── layouts/                 # Root and Dashboard layouts
│   │   ├── maps/                    # Interactive Leaflet atmospheric maps
│   │   ├── charts/                  # Recharts timeline & verification curves
│   │   ├── pages/                   # All 15 functional application routes
│   │   ├── services/                # API communication layer
│   │   ├── types/                   # TypeScript definitions
│   │   ├── App.tsx                  # Application routing
│   │   └── main.tsx
│   ├── public/originkit/hero-17/    # 3D globe assets & fast local GeoJSON vector
│   └── package.json
├── ml/
│   ├── datasets/                    # Synthetic meteorological dataset generator
│   ├── models/                      # Saved joblib scalers, XGBoost models & metadata JSON
│   ├── train.py                     # Chronological train/test split & metric calculation
│   ├── evaluate.py                  # Evaluation on holdout contingency tables
│   └── predict.py                   # Real-time multi-horizon inference engine
├── data/demo/                       # Generated dataset CSVs
├── docker/                          # Dockerfiles for frontend and backend
├── docker-compose.yml
├── start.bat                        # Windows 1-click startup
├── start.ps1                        # PowerShell 1-click startup
├── .env.example
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.12)
- **Git**

### 1. Launch via Startup Scripts (Recommended)

**On Windows Command Prompt:**
```cmd
start.bat
```

**On Windows PowerShell:**
```powershell
.\start.ps1
```

Both backend (`http://localhost:8000`) and frontend (`http://localhost:5173`) will launch concurrently in separate terminal windows.

---

### 2. Manual Startup

#### Step A: Backend Setup
```bash
# From workspace root
pip install -r backend/requirements.txt

# Run initial ML model training (creates artifacts & verified metrics)
python ml/train.py

# Start FastAPI server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
Backend API will be accessible at:
- **Base URL**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/health`

#### Step B: Frontend Setup
```bash
# In a new terminal window
cd frontend
npm install
npm run dev
```
Frontend will be accessible at:
- **Application URL**: `http://localhost:5173`

---

## 🐳 Docker Deployment

To launch the complete containerized stack using Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

---

## 🤖 AI/ML Training & Verification

To train the multi-sensor nowcasting models from scratch:

```bash
python ml/train.py
```
This script:
1. Loads/generates a 4,000-sample physically consistent convective dataset.
2. Performs an 80/20 chronological split to avoid data leakage.
3. Fits feature scalers on 18 multi-sensor parameters.
4. Trains gradient boosted decision trees for 30m, 60m, and 120m horizons.
5. Computes genuine meteorological verification metrics (POD, FAR, CSI, Brier Score, ROC-AUC) and saves artifacts to `ml/models/`.

To inspect test set evaluation:
```bash
python ml/evaluate.py
```

---

## 🛡️ Safety Disclaimer

TempestIQ provides experimental probabilistic weather intelligence designed for research, nowcasting demonstration, and decision-support modeling. It does **not** replace official meteorological warnings issued by governmental meteorological agencies (such as IMD, NOAA, or ECMWF).
