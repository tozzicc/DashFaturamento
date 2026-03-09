<#
start_all.ps1

Abre duas janelas PowerShell para iniciar o backend e o frontend em modo desenvolvimento.

Uso:
  .\start_all.ps1           # apenas abre os servidores (assume dependências já instaladas)
  .\start_all.ps1 -InstallDeps    # instala dependências antes de iniciar
  .\start_all.ps1 -BuildBackend   # faz build do backend e roda em produção (npm start)
#>

param(
    [switch]$InstallDeps,
    [switch]$BuildBackend
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "..\backend"
$frontend = Join-Path $root "..\frontend"

Write-Host "Projeto root: $root"
Write-Host "Backend: $backend"
Write-Host "Frontend: $frontend"

if ($InstallDeps) {
    Write-Host "Instalando dependências do backend..."
    Push-Location $backend
    npm install
    Pop-Location

    Write-Host "Instalando dependências do frontend..."
    Push-Location $frontend
    npm install
    Pop-Location
}

if ($BuildBackend) {
    $backendCmd = "cd '$backend'; npm run build; npm start"
} else {
    $backendCmd = "cd '$backend'; npm run dev"
}

$frontendCmd = "cd '$frontend'; npm run dev"

Write-Host "Iniciando backend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-NoProfile","-Command",$backendCmd

Start-Sleep -Milliseconds 500

Write-Host "Iniciando frontend..."
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-NoProfile","-Command",$frontendCmd

Write-Host "Pronto — duas janelas PowerShell foram abertas (backend e frontend)." 
