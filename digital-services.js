const { DIGITAL_SERVICES } = require('../lib/data');
module.exports = (req, res) => res.status(200).json(DIGITAL_SERVICES);
