const { SECURE_APP } = require('../lib/data');
module.exports = (req, res) => res.status(200).json(SECURE_APP);
