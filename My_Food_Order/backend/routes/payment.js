const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const {
  processPayment,
  sendStripeApi,
} = require("../controllers/paymentController");

router.route("/payment/process").post(authController.protect, processPayment);
router.route("/stripeapi").get(authController.protect, sendStripeApi);


module.exports = router;
