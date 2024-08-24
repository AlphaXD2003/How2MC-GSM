const { Router } = require("express");

const router = Router();

const {
  getAllLocations,
  getLocation,
  getNodesOfLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  listLocations,
  syncLocationsWithNodes,
  getSyncedLocations
} = require("../controllers/location.controller");


router.route("/").get(listLocations);
router.route('/sync-location-node').get(syncLocationsWithNodes)
router.route('/location-node').get(getSyncedLocations)
router.route("/list-locations").get(getAllLocations);
router.route("/get-location/:locationId").get(getLocation);
router.route("/get-location-nodes/:locationId").get(getNodesOfLocation);
router.route("/create-location").post(createLocation);
router.route("/update-location/:locationId").patch(updateLocation);
router.route("/delete-location/:locationId").delete(deleteLocation);

module.exports = router;
