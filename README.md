# Cloudflared Deploy Server

A simple Node.js deployment endpoint exposed securely via Cloudflare Tunnel.

## Features

- Accepts ZIP file + target path
- Extracts safely to temp
- Moves files to destination
- Returns created / overwritten / failed file list

---

## Setup

### 1. Install dependencies

npm install

### 2. Start server

npm start

Server runs on:
http://localhost:3000

---

## Cloudflare Tunnel

After installing cloudflared:

cloudflared tunnel --url http://localhost:3000

---

## Deploy Request Example

POST /deploy
Form Data:
- file: <zip file>
- path: ./deployments/my-app

Response:
{
  "status": "completed",
  "created": [],
  "overwritten": [],
  "failed": []
}
