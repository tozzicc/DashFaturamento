@echo off
rem start_env.bat
rem Tenta iniciar o serviço do SQL Server (MSSQLSERVER ou SQLEXPRESS) e em seguida inicia a aplicação

setlocal
set "ROOT=%~dp0"

echo Procurando serviço do SQL Server...
sc query MSSQLSERVER >nul 2>&1
if %errorlevel%==0 (
  set "SERVICE=MSSQLSERVER"
) else (
  sc query "MSSQL$SQLEXPRESS" >nul 2>&1
  if %errorlevel%==0 set "SERVICE=MSSQL$SQLEXPRESS"
)

if "%SERVICE%"=="" (
  echo AVISO: Nenhum serviço SQL Server padrao encontrado (MSSQLSERVER / MSSQL$SQLEXPRESS).
  echo Inicie o serviço do banco manualmente ou substitua o nome do serviço neste arquivo.
) else (
  echo Iniciando servico %SERVICE% ...
  net start "%SERVICE%"
)

echo Iniciando backend e frontend (Windows Terminal)...
if exist "%ROOT%start_all_wt.bat" (
  call "%ROOT%start_all_wt.bat" %*
) else (
  echo start_all_wt.bat nao encontrado. Rode scripts\run_all.ps1 ou start_all.bat manualmente.
)

endlocal
