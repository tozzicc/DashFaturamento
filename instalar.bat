@echo off
REM Script de instalação automática do projeto

echo.
echo ========================================
echo Dashboard Velocimetro Faturamento
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Por favor instale Node.js primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version
echo.

REM Instalar Backend
echo ========================================
echo Instalando Backend...
echo ========================================
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar backend
    pause
    exit /b 1
)
echo ✅ Backend instalado com sucesso
cd ..
echo.

REM Instalar Frontend
echo ========================================
echo Instalando Frontend...
echo ========================================
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar frontend
    pause
    exit /b 1
)
echo ✅ Frontend instalado com sucesso
cd ..
echo.

echo ========================================
echo ✅ Instalação Concluída!
echo ========================================
echo.
echo 🚀 Para iniciar o projeto:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Abra o navegador em: http://localhost:5173
echo.
pause
