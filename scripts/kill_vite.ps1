$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -like '*vite*' -or $_.CommandLine -like '*node_modules\\.bin*vite*') }
if ($procs) {
  $procs | Select-Object ProcessId,CommandLine | ForEach-Object {
    Write-Output "Stopping Vite PID: $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
} else {
  Write-Output 'No vite processes found'
}
