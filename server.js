const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Load .env if present
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const GREETING = process.env.APP_GREETING || 'Hello from DummyDevBoxApp!';

const server = http.createServer((req, res) => {
  const payload = {
    status: 'ok',
    message: GREETING,
    envLoaded: fs.existsSync(envPath),
    customConfig: process.env.CUSTOM_CONFIG || null,
    url: req.url,
    method: req.method,
    headers: req.headers,
    boundHost: HOST,
    boundPort: PORT,
    timestamp: new Date().toISOString()
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload, null, 2) + '\n');
});

server.listen(PORT, HOST, () => {
  console.log(`[DummyDevBoxApp] Server listening on http://${HOST}:${PORT}`);
});
