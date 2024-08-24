const { nestDetails, getNestOfEgg, getEggsOfNest } = require('../controllers/nests.controller');

const router = require('express').Router();

router.route('/nest-details').get(nestDetails)
router.route('/get-nest-of-egg/:id').get(getNestOfEgg)
router.route('/get-eggs-of-nests/:id').get(getEggsOfNest)


module.exports = router;