const { Router } = require("express");

const {
  listServers,
  showAllPermissions,
} = require("../../controllers/client/client.controller");

const router = Router();

router.route("/").get(listServers);
router.route("/permission").get(showAllPermissions);

module.exports = router;
