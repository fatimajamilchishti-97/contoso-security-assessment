const { INFRASTRUCTURE } = require('../lib/data');
module.exports = (req, res) => res.status(200).json(INFRASTRUCTURE);
