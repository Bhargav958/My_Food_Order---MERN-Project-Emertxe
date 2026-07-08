// routes/restaurants.js

const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");

router.get("/count", async (req, res) => {
  try {
    const count = await Restaurant.countDocuments();
    res.json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch the number of restaurants." });
  }
});

module.exports = router;
