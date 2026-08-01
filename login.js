const { USERS } = require('./lib/data');
module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password, mfaCode } = req.body || {};
  const result = checkLogin(username, password, mfaCode);
  res.status(result.token ? 200 : 401).json(result);
};
