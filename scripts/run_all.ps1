<#
run_all.ps1

Script helper para executar em sequência:
- instalar dependências (backend + frontend)
- adicionar perfis ao Windows Terminal (opcional)
- abrir o Windows Terminal com as guias do projeto

Uso:
  .\run_all.ps1 -InstallDeps -AddProfiles -Force
  .\run_all.ps1 -AddProfiles
  .\run_all.ps1
#>

param(
    [switch]$InstallDeps,
    [switch]$AddProfiles,
    [switch]$Force
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Resolve-Path (Join-Path $scriptDir "..")

Write-Host "Projeto root: $root"

if ($InstallDeps) {
    Write-Host "Instalando dependências (backend)..."
    Push-Location (Join-Path $root 'backend')
    npm install
    Pop-Location

    Write-Host "Instalando dependências (frontend)..."
    Push-Location (Join-Path $root 'frontend')
    npm install
    Pop-Location
}

if ($AddProfiles) {
    $addScript = Join-Path $scriptDir 'add_wt_profiles.ps1'
    if (Test-Path $addScript) {
        $args = @()
        if ($Force) { $args += '-Force' }
        Write-Host "Executando $addScript $($args -join ' ')"
        & $addScript @args
    } else {
        Write-Warning "Não encontrado: $addScript. Pulando a etapa de profiles."
    }
}

# Launch Windows Terminal launcher (usa o atalho criado anteriormente)
$wtLauncher = Join-Path $root 'start_all_wt.bat'
if (Test-Path $wtLauncher) {
    $launchArgs = @()
    if ($InstallDeps) { $launchArgs += '-InstallDeps' }
    Write-Host "Abrindo Windows Terminal via $wtLauncher"
    Start-Process -FilePath $wtLauncher -ArgumentList $launchArgs -WorkingDirectory $root
} else {
    Write-Warning "Launcher $wtLauncher não encontrado. Tentando start_all.bat..."
    $alt = Join-Path $root 'start_all.bat'
    if (Test-Path $alt) { Start-Process -FilePath $alt -WorkingDirectory $root } else { Write-Error "Nenhum launcher encontrado." }
}

Write-Host "Sequência iniciada. Verifique as janelas abertas para logs." 
