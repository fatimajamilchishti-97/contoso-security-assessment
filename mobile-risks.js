const { MOBILE_RISKS } = require('../lib/data')
module.exports = (req, res) => res.status(200).json(MOBILE_RISKS);
