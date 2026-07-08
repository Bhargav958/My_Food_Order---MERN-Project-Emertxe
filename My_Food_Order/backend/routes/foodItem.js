const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getFoodItem,
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
} = require("../controllers/foodItemController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");
router.route("/item").post(protect, authorizeRoles("admin"), createFoodItem);

router.route("/items/:storeId").get(getAllFoodItems);
router
  .route("/item/:foodId")
  .get(getFoodItem)
  .patch(protect, authorizeRoles("admin"), updateFoodItem)
  .delete(protect, authorizeRoles("admin"), deleteFoodItem);

module.exports = router;
