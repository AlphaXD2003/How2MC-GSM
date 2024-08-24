const { Router } = require("express");
const { getEggInfo, getServerOfEgg, eggDetails, getEggInformation } = require("../controllers/eggs.controller");

const router = Router();

router.route('/egg-details').get(eggDetails);
router.route("/egginfo").post(getEggInformation);
router.route("/egginfo/:nestId/:eggId").get(getEggInfo);
router.route("/serverofegg/:nestId/:eggId").get(getServerOfEgg);

module.exports = router;
