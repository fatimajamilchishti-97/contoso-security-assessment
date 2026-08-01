export default async function handler(req, res) {
  // Setup CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body;

    // Handle case where body is a raw unparsed string
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // Fallback for form-url-encoded text string data
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const username = body?.username || '';
    const password = body?.password || '';

    // Verify credentials directly
    if (username === 'admin' && password === 'Admin@2026') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ success: true, token: "mock-jwt-token" });
    } else {
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: "Invalid username or password" });
    }
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(405).json({ error: "Method not allowed" });
}
