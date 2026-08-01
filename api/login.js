const { USERS } = require('../lib/data');

module.exports = async function handler(req, res) {
  // Setup standard headers for browser security
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Parse the username and password from the frontend submission request
  if (req.method === 'POST') {
    let body = req.body || {};
    
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { username, password } = body;

    // Check credentials matching your project specifications
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

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: "Method not allowed" }));
};
