const { USERS } = require('../lib/data');

export default async function handler(req, res) {
  // Allow browser CORS operations 
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Guard against pre-flight connection requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { username, password } = req.body || {};

    if (username === 'admin' && password === 'Admin@2026') {
      return res.status(200).json({ success: true, token: "mock-jwt-token" });
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
