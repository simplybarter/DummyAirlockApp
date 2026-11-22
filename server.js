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
const GREETING = process.env.APP_GREETING || 'Hello from DummyAirlockApp!';
const HTML_FILE = path.resolve(__dirname, 'public', 'index.html');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const accept = req.headers.accept || '';
  const userAgent = req.headers['user-agent'] || '';

  // Backend API: /api/ping
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      pong: true,
      service: 'dummy-airlock-backend',
      tier: 'backend',
      timestamp: new Date().toISOString()
    }, null, 2) + '\n');
    return;
  }

  // Backend API: /api/status or /api/health
  if (pathname === '/api/status' || pathname === '/api/health') {
    const payload = {
      status: 'ok',
      tier: 'backend',
      message: GREETING,
      envLoaded: fs.existsSync(envPath),
      customConfig: process.env.CUSTOM_CONFIG || null,
      uptimeSeconds: Math.floor(process.uptime()),
      boundHost: HOST,
      boundPort: PORT,
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload, null, 2) + '\n');
    return;
  }

  // Frontend UI: explicitly requested via /dashboard, /frontend, or /index.html
  // or requested via / with text/html in Accept header (browser requests)
  const prefersHtml = accept.includes('text/html') || pathname === '/dashboard' || pathname === '/frontend' || pathname === '/index.html';

  if (pathname === '/' && !prefersHtml) {
    // Default JSON response for root curl / automated integration tests
    const payload = {
      status: 'ok',
      message: GREETING,
      tier: 'fullstack (backend + frontend)',
      envLoaded: fs.existsSync(envPath),
      customConfig: process.env.CUSTOM_CONFIG || null,
      routes: {
        frontend: '/dashboard',
        apiStatus: '/api/status',
        apiPing: '/api/ping'
      },
      url: req.url,
      method: req.method,
      headers: req.headers,
      boundHost: HOST,
      boundPort: PORT,
      timestamp: new Date().toISOString()
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload, null, 2) + '\n');
    return;
  }

  // Serve Frontend UI
  if (fs.existsSync(HTML_FILE)) {
    const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlContent);
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', path: pathname }) + '\n');
});

server.listen(PORT, HOST, () => {
  console.log(`[DummyAirlockApp Fullstack] Server listening on http://${HOST}:${PORT}`);
});
