import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantList from "../../components/RestaurantList";
import FoodList from "../../components/FoodList";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const { token } = useAuth();
  useEffect(() => {
    axios.get("http://localhost:5000/api/menu/restaurants").then((res) => {
      setRestaurants(res.data);
    });
  }, []);

  const handleOrder = (items) => {
    axios
      .post(
        "http://localhost:5000/api/orders",
        {
          restaurantId: selected.id,
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Đặt món thành công 🎉");
        setSelected(null);
      })
      .catch((err) => alert("Lỗi khi đặt món"));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/orders" className="text-blue-600 hover:underline">
        Danh sách đơn đã đặt
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-center">Danh sách quán ăn</h1>
      {!selected ? (
        <RestaurantList restaurants={restaurants} onSelect={setSelected} />
      ) : (
        <>
          <button
            className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={() => setSelected(null)}
          >
            ← Quay lại danh sách quán
          </button>
          <FoodList restaurant={selected} onOrder={handleOrder} />
        </>
      )}
    </div>
  );
};

export default MenuPage;
