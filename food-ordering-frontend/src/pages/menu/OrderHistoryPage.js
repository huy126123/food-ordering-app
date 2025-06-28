import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import FloatingChat from "../../components/FloatingChat";

const OrderHistoryPage = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-center mt-8">Đang tải đơn hàng...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        ← Quay lại đặt món
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">
        🧾 Lịch sử đơn hàng
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Bạn chưa đặt đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <h2 className="font-semibold text-lg mb-2">
                📍 {order.restaurantName}
              </h2>
              <ul className="mb-2 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-green-600">
                Trạng thái:{" "}
                {order.status === "completed"
                  ? "✅ Đã hoàn tất"
                  : "⏳ Đang chuẩn bị"}
              </p>
              <div className="text-right font-semibold text-blue-600">
                Tổng: {order.total.toLocaleString()}đ
              </div>

              <button
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedOrder(order._id)}
              >
                💬 Chat với nhà hàng
              </button>
            </div>
          ))}
        </div>
      )}

      <FloatingChat
        selectedOrder={selectedOrder}
        user={user}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrderHistoryPage;
