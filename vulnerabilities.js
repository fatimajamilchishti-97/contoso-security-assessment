const { getVulnerabilities, cycleVulnerabilityStatus } = require('../lib/data');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(getVulnerabilities());
  }
  if (req.method === 'POST') {
    const { id } = req.body || {};
    const updated = cycleVulnerabilityStatus(id);
    if (!updated) return res.status(404).json({ error: 'Vulnerability not found' });
    return res.status(200).json(updated);
  }
  res.status(405).json({ error: 'Method not allowed' });
};
