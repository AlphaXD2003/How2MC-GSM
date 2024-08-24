const router = require("express").Router();
const { verifyJWT } = require("../../middlewares/auth.middleware");
const { createOrder, verifyOrder } = require("../../controllers/payment/razorpay/razorpay.controller");

router.route("/create-order").post( verifyJWT ,createOrder);
router.route("/verify-order").post( verifyJWT ,verifyOrder);



module.exports = router;