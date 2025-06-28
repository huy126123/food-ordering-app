const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: { type: String, required: true },
    items: [
      {
        foodId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "completed", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
