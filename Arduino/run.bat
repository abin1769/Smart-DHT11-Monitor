@echo off
echo 🚀 Smart DHT11 Monitor Launcher
echo ===============================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python tidak ditemukan. Silakan install Python terlebih dahulu.
    pause
    exit /b 1
)

REM Check if Flask is installed
python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Flask belum terinstall. Menginstall dependencies...
    python -m pip install flask pyserial
    if %errorlevel% neq 0 (
        echo ❌ Gagal menginstall dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies OK
echo.

REM Check if Arduino is connected
echo 🔌 Checking Arduino connection...
python -c "import serial; serial.Serial('COM5', 9600, timeout=1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Arduino tidak terdeteksi di COM5
    echo    Pastikan Arduino sudah terhubung dan sketch sudah diupload
    echo.
) else (
    echo ✅ Arduino terdeteksi di COM5
    echo.
)

echo 🌐 Starting Flask server...
echo    Web interface: http://localhost:5000
echo    Press Ctrl+C to stop
echo.

REM Start the Flask application
python app.py

echo.
echo 👋 Flask server stopped
pause
