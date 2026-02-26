$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -match 'src/index.ts' -or $_.CommandLine -match 'tsx') }
if ($procs) {
  $procs | Select-Object ProcessId,CommandLine | ForEach-Object {
    Write-Output "Killing PID: $($_.ProcessId)"
    Stop-Process -Id $($_.ProcessId) -Force -ErrorAction SilentlyContinue
  }
} else {
  Write-Output 'No matching backend processes found'
}
