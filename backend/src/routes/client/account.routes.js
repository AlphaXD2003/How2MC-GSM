const { Router } = require("express");
const {
  getAccount,
  get2FA,
  enable2FA,
  disable2FA,
  updateEmail,
  updatePassword,
  getAPIKey,
  createAPIKey,
  deleteAPIKey,
  getAdminAccount
} = require("../../controllers/client/account.controller");
const router = Router();

router.route("/").get(getAccount);
router.route("/admin").get(getAdminAccount);
router.route("/two-factor").get(get2FA);
router.route("/two-factor/enable").post(enable2FA);
router.route("/two-factor/disable").delete(disable2FA);
router.route("/update/email").patch(updateEmail);
router.route("/update/password").patch(updatePassword);
router.route("/get/api-key").get(getAPIKey);
router.route("/create/api-key").post(createAPIKey);
router.route("/delete/api-key/:id").delete(deleteAPIKey);

module.exports = router;
