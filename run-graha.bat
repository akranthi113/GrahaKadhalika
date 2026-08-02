@echo off
cd /d "%~dp0"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting development server...
start "GrahaKadhalika Dev Server" /min cmd /c "npm run dev"

timeout /t 5 /nobreak >nul
echo Opening browser...
start http://localhost:5173/

pause
