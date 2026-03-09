@echo off
rem Atalho para iniciar backend e frontend via PowerShell script
rem Uso: start_all.bat [opções]
rem Exemplos:
rem   start_all.bat            -> inicia backend (dev) + frontend (dev)
rem   start_all.bat -InstallDeps -> instala dependências e inicia
rem   start_all.bat -BuildBackend -> build backend e inicia em produção

powershell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0scripts\start_all.ps1' %*"
