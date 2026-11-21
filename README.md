# DummyDevBoxApp

This is a test application created to verify the **DevBox MCP Control Plane** integration:

- **Internal Port**: 3000 (configurable via `PORT` environment variable)
- **Host Binding**: `0.0.0.0` (configurable via `HOST` environment variable)
- **Startup Command**: `npm start` (or `node server.js`)
- **Zero Dependencies**: Uses standard Node.js `node:http`.

## DevBox Integration Target

- **VM Host**: `barkley`
- **Guest VM**: `barkley-vm`
- **Internal Port**: 3000
- **External Proxy Port**: 3001 (or allocated dynamically)
