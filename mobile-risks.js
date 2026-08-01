const { MOBILE_RISKS } = require('../lib/data');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    res.statusCode = 200;
    return res.end(JSON.stringify(MOBILE_RISKS || []));
  }
  
  res.statusCode = 405;
  return res.end(JSON.stringify({ error: "Method not allowed" }));
};
