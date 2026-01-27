param(
  [int]$Port = 8443
)

$ErrorActionPreference = "Stop"

function Get-LanIp {
  $ip = Get-NetIPAddress -AddressFamily IPv4 `
    | Where-Object { $_.IPAddress -notlike "169.254*" -and $_.IPAddress -notlike "127.*" } `
    | Select-Object -First 1 -ExpandProperty IPAddress
  if (-not $ip) {
    throw "Could not determine a LAN IPv4 address."
  }
  return $ip
}

function Get-MkcertPath {
  $candidates = @(
    "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\FiloSottile.mkcert_Microsoft.Winget.Source_8wekyb3d8bbwe\mkcert.exe",
    "$env:ProgramFiles\mkcert\mkcert.exe",
    "$env:LOCALAPPDATA\mkcert\mkcert.exe"
  )

  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }

  $cmd = Get-Command mkcert -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  return $null
}

$mkcert = Get-MkcertPath
if (-not $mkcert) {
  Write-Host "mkcert not found. Install it with:" -ForegroundColor Yellow
  Write-Host "  winget install -e --id FiloSottile.mkcert" -ForegroundColor Yellow
  exit 1
}

$lanIp = Get-LanIp

if (-not (Test-Path "cert.pem") -or -not (Test-Path "key.pem")) {
  & $mkcert -install | Out-Host
  & $mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1 $lanIp | Out-Host
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host "Python not found on PATH. Install Python 3.x and retry." -ForegroundColor Yellow
  exit 1
}

$serverScript = @"
import http.server, ssl
from functools import partial

handler = partial(http.server.SimpleHTTPRequestHandler, directory=".")
httpd = http.server.ThreadingHTTPServer(("0.0.0.0", $Port), handler)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="cert.pem", keyfile="key.pem")
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print("Serving https://0.0.0.0:$Port")
httpd.serve_forever()
"@

$serverScript | & $python.Source -
