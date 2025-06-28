const express = require("express");
const router = express.Router();
const menuData = require("../data/menuData.json");

router.get("/restaurants", (req, res) => {
  res.json(menuData.restaurants);
});

router.get("/restaurants/:id", (req, res) => {
  const restaurant = menuData.restaurants.find((r) => r.id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: "Not found" });
  res.json(restaurant);
});

module.exports = router;
