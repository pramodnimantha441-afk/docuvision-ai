@echo off
echo Starting Hand2Text Pro Backend...
echo.
echo Note: First startup takes 60-90 seconds to load models.
echo Once loaded, keep this window open while using the app.
echo.
cd /d "%~dp0"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
