// api.js — thin client for the Contoso Security Assessment API.
// Uses relative paths, so this works identically whether you're running it
// locally (node server.js) or deployed on Vercel — no configuration needed.
const API_BASE = '/api';


const Api = {
  async login(username, password, mfaCode) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, mfaCode }),
    });
    return res.json();
  },
  async logout() {
    localStorage.removeItem('contoso_token');
    localStorage.removeItem('contoso_user');
  },
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    });
    if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
    return res.json();
  },
};
