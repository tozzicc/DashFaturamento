@echo off
rem Windows Terminal launcher for backend + frontend
rem Usage: start_all_wt.bat [-InstallDeps] [-BuildBackend]

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

if "%~1"=="-InstallDeps" (
  echo Installing dependencies...
  pushd "%BACKEND%"
  npm install
  popd
  pushd "%FRONTEND%"
  npm install
  popd
)

if "%~1"=="-BuildBackend" (
  set "BACKEND_CMD=cd /d "%BACKEND%" ; npm run build ; npm start"
) else (
  set "BACKEND_CMD=cd /d "%BACKEND%" ; npm run dev"
)

set "FRONTEND_CMD=cd /d "%FRONTEND%" ; npm run dev"

rem Launch Windows Terminal with two tabs
wt new-tab powershell -NoExit -NoProfile -Command "%BACKEND_CMD%" ; new-tab powershell -NoExit -NoProfile -Command "%FRONTEND_CMD%"

echo Launched Windows Terminal.
