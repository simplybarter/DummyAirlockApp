const http = require('node:http');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
  const payload = {
    status: 'ok',
    message: 'Hello from DummyDevBoxApp!',
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
