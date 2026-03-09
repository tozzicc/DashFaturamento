<#
schedule_snapshot.ps1

Cria uma tarefa agendada no Windows que faz POST em /api/snapshots diariamente no horário especificado.

Uso:
  .\schedule_snapshot.ps1 -Time "23:45" -Url "http://localhost:3000/api/snapshots" -TaskName "DashFaturamento_Snapshot"
#>

param(
  [string]$Time = '23:45',
  [string]$Url = 'http://localhost:3000/api/snapshots',
  [string]$TaskName = 'DashFaturamento_Snapshot',
  [switch]$Force
)

$command = "powershell -NoProfile -WindowStyle Hidden -Command \"try{Invoke-RestMethod -Uri '$Url' -Method Post -TimeoutSec 60}catch{Write-Output 'Snapshot call failed: ' + $_} \""

Write-Host "Criando tarefa agendada '$TaskName' para chamar $Url às $Time (diariamente)"

$exists = schtasks /Query /TN $TaskName 2>$null
if ($LASTEXITCODE -eq 0) {
  if (-not $Force) {
    Write-Host "Tarefa já existe. Use -Force para recriar."; exit 0
  }
  Write-Host "Removendo tarefa existente..."
  schtasks /Delete /TN $TaskName /F | Out-Null
}

# Criar a tarefa
$schtaskCmd = "schtasks /Create /SC DAILY /TN \"$TaskName\" /TR \"$command\" /ST $Time /F"
Write-Host "Executando: $schtaskCmd"
Invoke-Expression $schtaskCmd
Write-Host 'Tarefa criada.'
