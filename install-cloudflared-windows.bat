@echo off
echo Installing Cloudflare Tunnel (cloudflared)...

powershell -Command "Invoke-WebRequest https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe -OutFile cloudflared.exe"

echo Cloudflared downloaded.
echo Move cloudflared.exe to a directory in your PATH if needed.

pause
