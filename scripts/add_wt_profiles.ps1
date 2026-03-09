<#
add_wt_profiles.ps1

Encontra o settings.json do Windows Terminal, cria backup e injeta dois perfis
para o backend e o frontend do projeto DashFaturamento.

Uso:
  .\add_wt_profiles.ps1                # tenta detectar settings.json e aplica alterações
  .\add_wt_profiles.ps1 -DryRun        # mostra o que seria alterado, sem gravar
  .\add_wt_profiles.ps1 -SettingsPath "C:\path\to\settings.json" -Force  # força substituição

Observações:
- O script faz backup do arquivo original (settings.json.bak.TIMESTAMP).
- Se o settings.json contiver comentários e falhar ao parsear, use `-Force`
  para que o script remova comentários antes de processar.
#>

param(
  [string]$SettingsPath,
  [string]$ProjectRoot = (Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent),
  [switch]$DryRun,
  [switch]$Force
)

function Find-SettingsJson {
  param()
  $candidates = @(
    "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json",
    "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json",
    "$env:LOCALAPPDATA\Microsoft\Windows Terminal\settings.json"
  )
  foreach ($p in $candidates) { if (Test-Path $p) { return $p } }

  try {
    $found = Get-ChildItem -Path $env:LOCALAPPDATA -Filter settings.json -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { return $found.FullName }
  } catch {}

  return $null
}

if (-not $SettingsPath) {
  $SettingsPath = Find-SettingsJson
  if (-not $SettingsPath) {
    Write-Error "Não foi possível localizar settings.json automaticamente. Informe -SettingsPath."; exit 1
  }
}

Write-Host "Usando settings.json em: $SettingsPath"

$content = Get-Content -Raw -LiteralPath $SettingsPath -ErrorAction Stop

function Try-ParseJson([string]$txt) {
  try {
    return $txt | ConvertFrom-Json -ErrorAction Stop
  } catch {
    return $null
  }
}

$json = Try-ParseJson $content
if (-not $json) {
  if (-not $Force) {
    Write-Error "Falha ao parsear JSON. Se o arquivo contiver comentários, rode com -Force para removê-los automaticamente."; exit 1
  }
  Write-Host "Tentando remover comentários e parsear novamente (modo -Force)..."
  $clean = $content -replace '(?s)/\*.*?\*/','' -replace '(?m)//.*$',''
  $json = Try-ParseJson $clean
  if (-not $json) { Write-Error "Ainda não foi possível parsear o settings.json."; exit 1 }
}

if (-not $json.profiles) { $json | Add-Member -MemberType NoteProperty -Name profiles -Value @{} }
if (-not $json.profiles.list) { $json.profiles.list = @() }

$backendPath = Join-Path $ProjectRoot 'backend'
$frontendPath = Join-Path $ProjectRoot 'frontend'

$backendProfile = [PSCustomObject]@{
  guid = '{b3f9a1d2-4c9a-4f7e-9b2b-1a2c3d4e5f60}'
  name = 'DashFaturamento - Backend'
  commandline = "powershell -NoExit -NoProfile -Command \"cd '$backendPath'; npm run dev\""
  startingDirectory = $backendPath
  hidden = $false
}

$frontendProfile = [PSCustomObject]@{
  guid = '{d4e2b6c7-7f8a-4b1c-a2d3-6e7f8a9b0c11}'
  name = 'DashFaturamento - Frontend'
  commandline = "powershell -NoExit -NoProfile -Command \"cd '$frontendPath'; npm run dev\""
  startingDirectory = $frontendPath
  hidden = $false
}

function Profile-Exists($list, $profile) {
  foreach ($p in $list) { if ($p.name -eq $profile.name -or $p.guid -eq $profile.guid) { return $p } }
  return $null
}

$list = $json.profiles.list

$changed = $false

$exists = Profile-Exists $list $backendProfile
if ($exists) {
  if ($Force) {
    Write-Host "Atualizando perfil existente: $($backendProfile.name)"
    $index = [array]::IndexOf($list, $exists)
    $list[$index] = $backendProfile
    $changed = $true
  } else { Write-Host "Perfil já existe, pulando: $($backendProfile.name)" }
} else {
  Write-Host "Adicionando perfil: $($backendProfile.name)"
  $list += $backendProfile
  $changed = $true
}

$existsF = Profile-Exists $list $frontendProfile
if ($existsF) {
  if ($Force) {
    Write-Host "Atualizando perfil existente: $($frontendProfile.name)"
    $index = [array]::IndexOf($list, $existsF)
    $list[$index] = $frontendProfile
    $changed = $true
  } else { Write-Host "Perfil já existe, pulando: $($frontendProfile.name)" }
} else {
  Write-Host "Adicionando perfil: $($frontendProfile.name)"
  $list += $frontendProfile
  $changed = $true
}

if (-not $changed) { Write-Host "Nenhuma alteração necessária."; exit 0 }

if ($DryRun) {
  Write-Host "--- DryRun: o novo objeto profiles.list seria ---"
  $list | ConvertTo-Json -Depth 10 | Write-Host
  exit 0
}

# Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = "$SettingsPath.bak.$timestamp"
Copy-Item -LiteralPath $SettingsPath -Destination $backup -Force
Write-Host "Backup criado em: $backup"

# Atualizar objeto e escrever de volta
$json.profiles.list = $list

$out = $json | ConvertTo-Json -Depth 20

Set-Content -LiteralPath $SettingsPath -Value $out -Encoding UTF8
Write-Host "Profiles adicionados com sucesso ao settings.json"
