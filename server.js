#!/usr/bin/env node
// server.js — run this locally with: node server.js
// No npm install, no dependencies — uses only Node's built-in http module.
// It serves the static frontend from /public AND dispatches /api/* requests to
// the exact same handler files Vercel uses in production (in /api). Same code,
// same behavior, whether you're running this on your laptop or deployed.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const API_DIR = path.join(ROOT, 'routes');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};

const STATIC_ALLOWED = [/^\/index\.html$/, /^\/dashboard\.html$/, /^\/css\//, /^\/js\//];

function serveStatic(req, res, pathname) {
  let urlPath = pathname === '/' ? '/index.html' : pathname;
  const allowed = STATIC_ALLOWED.some((re) => re.test(urlPath));
  if (!allowed) { res.writeHead(404); return res.end('Not found'); }
  const filePath = path.join(PUBLIC_DIR, urlPath);
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    let chunks = '';
    req.on('data', (c) => { chunks += c; });
    req.on('end', () => {
      if (!chunks) return resolve({});
      try { resolve(JSON.parse(chunks)); } catch (e) { resolve({}); }
    });
  });
}

async function handleApi(req, res, apiName) {
  let filePath = path.join(API_DIR, `${apiName}.js`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, `${apiName}.js`);
  }
  if (!fs.existsSync(filePath)) { res.writeHead(404); return res.end(JSON.stringify({ error: 'Not found' })); }

  req.body = await readBody(req);

  // Polyfill the res.status().json() convenience methods Vercel provides,
  // so the same handler code works locally too.
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  delete require.cache[require.resolve(filePath)]; // always fresh during local dev
  const handler = require(filePath);
  handler(req, res);
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);

  if (u.pathname.startsWith('/api/')) {
    const apiName = u.pathname.replace('/api/', '');
    try {
      await handleApi(req, res, apiName);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Server error', message: err.message }));
    }
    return;
  }

  serveStatic(req, res, u.pathname);
});

server.listen(PORT, () => {
  console.log(`\nContoso Security Assessment running at http://localhost:${PORT}`);
  console.log(`Login -> username: admin | password: Admin@2026 | MFA code: any 6 digits (e.g. 123456)\n`);
});
