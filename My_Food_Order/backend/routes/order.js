const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");

router.route("/new").post(authController.protect, newOrder);

router.route("/:id").get(authController.protect, getSingleOrder);
router.route("/me/myOrders").get(authController.protect, myOrders);

module.exports = router;
