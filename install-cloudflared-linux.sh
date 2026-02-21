#!/bin/bash

echo "Installing Cloudflare Tunnel (cloudflared)..."

curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

echo "Cloudflared installed successfully."
