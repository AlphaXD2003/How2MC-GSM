const { Router } = require("express");
const {
  deleteAllocation,
  getAllocation,
  deleteNode,
  listNodes,
  listServerOFNodes,
  getNodeDetails,
  getNodeConfiguration,
  createNode,
  updateNode,
  createAllocation,
  getNode
} = require("../controllers/nodes.controller");

const router = Router();

router.route('/node/:id').get(getNode);
router.route("/list-nodes").get(listNodes);
router.route("/list-server-of-node").get(listServerOFNodes);
router.route("/get-node/:id").get(getNodeDetails);
router.route("/get-node-configurations/:id").get(getNodeConfiguration);
router.route("/create-node").post(createNode);
router.route("/update-node/:id").patch(updateNode);
router.route("/delete-node/:id").delete(deleteNode);

router.route("/list-node-allocations/:id").get(getAllocation);
router.route("/create-node-allocation/:id").post(createAllocation);
router
  .route("/delete-node-allocation/:node_id/:allocation_id")
  .delete(deleteAllocation);

module.exports = router;
