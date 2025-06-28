import React, { useState } from "react";

const FoodList = ({ restaurant, onOrder }) => {
  const [quantities, setQuantities] = useState({});

  const handleChange = (foodId, quantity) => {
    setQuantities({ ...quantities, [foodId]: parseInt(quantity) || 0 });
  };

  const handleSubmit = () => {
    const selected = restaurant.foods
      .filter((f) => quantities[f.id] > 0)
      .map((f) => ({
        foodId: f.id,
        name: f.name,
        price: f.price,
        quantity: quantities[f.id],
      }));
    onOrder(selected);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Món ăn tại {restaurant.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurant.foods.map((f) => (
          <div key={f.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">{f.name}</h3>
            <p className="text-gray-500">{f.price.toLocaleString()}đ</p>
            <input
              type="number"
              min="0"
              className="border px-2 py-1 w-full mt-2"
              placeholder="Số lượng"
              value={quantities[f.id] || ""}
              onChange={(e) => handleChange(f.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Đặt món 🍱
      </button>
    </div>
  );
};

export default FoodList;
