# Restart Vite: kill any process listening on 5173, then start Vite
try {
    $p = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -ErrorAction SilentlyContinue
} catch {
    $p = $null
}
if ($p) {
    Write-Output "Killing PID: $p"
    try { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {}
} else {
    Write-Output "No process on port 5173"
}
Set-Location -Path 'c:\Projetos\Velocimetro faturamento\frontend'
# Start Vite (bind to all interfaces)
npx vite --host 0.0.0.0 --port 5173
