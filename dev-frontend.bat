@echo off
rem GENESIS.EXE frontend launcher (standing rule R2)
cd /d "%~dp0frontend"
where pnpm >nul 2>nul || (
  echo [GENESIS] pnpm not found. Install Node 22+ LTS, then run: corepack enable
  pause
  exit /b 1
)
if not exist node_modules (
  echo [GENESIS] Installing dependencies...
  call pnpm install || (pause & exit /b 1)
)
start "" http://localhost:5173
call pnpm dev
pause
