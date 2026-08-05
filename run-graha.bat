@echo off
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting development server...
start "GrahaKadhalika Dev Server" /min cmd /c "npm run dev -- --host"

timeout /t 5 /nobreak >nul

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do set LAN_IP=%%a
set LAN_IP=%LAN_IP: =%

echo.
echo ================================================================
echo  On your PHONE open:  http://%LAN_IP%:5173/
echo  (phone must be on the same Wi-Fi network)
echo ================================================================
echo.
echo Opening browser on this PC...
start http://localhost:5173/

pause
