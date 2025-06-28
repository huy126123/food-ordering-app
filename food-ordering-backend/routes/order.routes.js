const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/my", authMiddleware, orderController.getMyOrders);
router.post("/", authMiddleware, injectIO, orderController.createOrder);
router.get("/", orderController.getOrders);
router.put(
  "/:id/complete",
  authMiddleware,
  injectIO,
  orderController.completeOrder
);

function injectIO(req, res, next) {
  req.io = req.app.get("io");
  next();
}

module.exports = router;
