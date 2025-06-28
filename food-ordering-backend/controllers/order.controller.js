const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      customerId: req.user.id,
      restaurantId,
      items,
      total,
    });

    req.io.to(restaurantId).emit("new-order", order);

    res.status(201).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    req.io.to(order.customerId.toString()).emit("order-completed", order);
    console.log(
      "📢 Emitting order-completed to customer",
      order.customerId.toString()
    );
    console.log("📦 Order payload:", order);
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to complete order", error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      restaurantId: req.query.restaurantId || "",
    }).populate("customerId", "fullName email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Get orders failed", error: err.message });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch your orders", error: err.message });
  }
};
