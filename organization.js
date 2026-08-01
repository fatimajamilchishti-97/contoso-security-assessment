const { ORGANIZATION } = require('../lib/data');
module.exports = (req, res) => res.status(200).json(ORGANIZATION);
