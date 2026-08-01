const { ATTACK_STEPS, RESOLUTION_STEPS } = require('../lib/data');
module.exports = (req, res) => res.status(200).json({ attackSteps: ATTACK_STEPS, resolutionSteps: RESOLUTION_STEPS });
