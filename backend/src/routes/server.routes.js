const { Router } = require("express");
const {
  updateServer,
  getServerDetails,
  deletePteroServer,
  createServer,
  updateServerDetails,
  updateServerStartup,
  suspendServer,
  unsuspendServer,
  reinstallServer,
  forceDeleteServer,
  renewServer,
  getDatabasesOfServer,
  getDatabaseDetails,
  createDatabase,
  deleteDatabase,
  resetPassword,
  getFreeServer,
  getFreeServerOfUser,
  getServerInfo,
  getServersOfUser,
  getAllServers,
  isServerOwner,
  deleteServerByPteroId,
  getOwnerOfServerByPteroId,
} = require("../controllers/server.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = Router();
router.route("").get(verifyJWT, getAllServers);
router.route("/update/build/:id").patch(verifyJWT,updateServer);
router.route("/details/:id").get(getServerDetails);
router.route("/info/:id").get(getServerInfo);
router.route("/delete/safe/:id").delete(deletePteroServer);
router.route("/create").post(createServer);

router.route("/update/startup/:id").patch(updateServerStartup);
router.route("/update/details/:id").patch(updateServerDetails);
router.route("/suspend/:id").post(suspendServer);
router.route("/unsuspend/:id").post(unsuspendServer);
router.route("/reinstall/:id").post(reinstallServer);
router.route("/delete/force/:id").delete(forceDeleteServer);
router.route("/renew/:id").patch(renewServer).post(renewServer);

router.route("/database/:id").get(getDatabasesOfServer);
router.route("/database/:server_id/:database_id").get(getDatabaseDetails);
router.route("/database/create/:id").post(createDatabase);
router.route("/database/delete/:server_id/:database_id").delete(deleteDatabase);
router.route("/database/reset-password/:server_id/:database_id").post(resetPassword);

router.route("/user/free").get(verifyJWT,getFreeServer);
router.route('/user/free').post(verifyJWT,getFreeServerOfUser)

router.route("/user/servers").get(verifyJWT,getServersOfUser)
router.route("/user/isOwner/:id").get(verifyJWT,isServerOwner)

router.route('/delete-by-id').post(deleteServerByPteroId)
router.route('/get-owner').post(getOwnerOfServerByPteroId)
module.exports = router;
