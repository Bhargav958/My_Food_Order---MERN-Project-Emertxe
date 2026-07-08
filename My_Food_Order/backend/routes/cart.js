const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

// Add to cart
router.post("/add-to-cart", cartController.addItemToCart);

// Update cart item quantity
router.post("/update-cart-item", cartController.updateCartItemQuantity);
router.delete("/delete-cart-item", cartController.deleteCartItem);
router.get("/get-cart", authController.protect, cartController.getCartItem);

module.exports = router;
