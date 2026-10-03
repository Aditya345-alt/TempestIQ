@echo off
echo ======================================================================
echo                  STARTING TEMPESTIQ PLATFORM
echo       AI/ML Thunderstorm and Lightning Nowcasting Engine
echo ======================================================================
echo.

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "TempestIQ Backend" cmd /k "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "TempestIQ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo Platform is active:
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo ======================================================================
pause
