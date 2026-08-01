const { getActivityLog, addActivity } = require('../lib/data');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(getActivityLog());
  }
  if (req.method === 'POST') {
    const { event, severity } = req.body || {};
    const time = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const entry = { time, event: event || 'Activity logged', severity: severity || 'Medium' };
    return res.status(200).json(addActivity(entry));
  }
  res.status(405).json({ error: 'Method not allowed' });
};
