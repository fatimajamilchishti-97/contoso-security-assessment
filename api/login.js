const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // Setup standard CORS headers for browser clearance
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method === 'POST') {
    // Parse manual chunks if incoming body parser data stream isn't processed yet
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback parameter parsing logic
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const username = body.username || '';
    const password = body.password || '';

    // Direct credential logic validation check 
    if (username === 'admin' && password === 'Admin@2026') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, token: "mock-jwt-token" }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Invalid username or password" }));
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 405;
  return res.end(JSON.stringify({ error: "Method not allowed" }));
};
