const router = require("express").Router();



const {
    createOrder,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
  updateOrder,
  pauseSubscription,
  resumeSubscription
} = require("../../controllers/orders/order.controller");


router.route("/create").post(createOrder);
router.route("/getOrdersByUserId").post(getOrdersByUserId);
router.route("/getOrderById").post(getOrderById);
router.route("/cancelOrder").post(cancelOrder);
router.route("/updateOrder").post(updateOrder);
router.route("/pauseSubscription").post(pauseSubscription);
router.route("/resumeSubscription").post(resumeSubscription);

module.exports = router