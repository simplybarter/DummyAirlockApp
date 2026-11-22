# DummyAirlockApp (Fullstack Edition)

This is a decoupled full-stack test application created to verify the **AirlockVM MCP Control Plane** integration:

- **Frontend**: Responsive HTML/CSS dashboard (`public/index.html`) served on `/dashboard` or with browser `Accept: text/html`.
- **Backend API**:
  - `GET /` — API telemetry payload (or frontend for browsers)
  - `GET /api/status` — Live status, uptime, environment config
  - `GET /api/ping` — Lightweight pong response
  - `GET /api/health` — Service health check
- **Internal Port**: 3000 (configurable via `PORT` environment variable)
- **Host Binding**: `0.0.0.0` (configurable via `HOST` environment variable)
- **Startup Command**: `npm start` (or `node server.js`)
- **Zero Dependencies**: Pure Node.js standard library (`node:http`, `node:fs`, `node:path`).

## AirlockVM Integration Target

- **VM Host**: `remotehost`
- **Guest VM**: `dummy-airlock-app-vm`
- **Internal Port**: 3000
- **External Proxy Port**: 3002 (forwarded via `http://remotehost:3002/`)
