const { MICROSOFT_INTRO } = require('../lib/data')
module.exports = (req, res) => res.status(200).json(MICROSOFT_INTRO);
