import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketProvider";
import { toast } from "react-toastify";
import FloatingChat from "../../components/FloatingChat";

const AdminPage = () => {
  const socket = useSocket();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/menu/restaurants`)
      .then((res) => setRestaurants(res.data));
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/orders?restaurantId=${selectedRestaurant.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setOrders(res.data))
      .catch(() => alert("Lỗi khi tải đơn hàng"));
  }, [selectedRestaurant]);

  useEffect(() => {
    if (!selectedRestaurant) return;

    socket.emit("join", selectedRestaurant.id);
    console.log(
      "👂 Admin joined restaurant socket room:",
      selectedRestaurant.id
    );

    const handleNewOrder = (order) => {
      console.log("📦 New order received via socket:", order);
      toast.info(`🛎️ Đơn mới từ ${order.customerName || "khách hàng"}!`);
      setOrders((prev) => [...prev, order]);
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.emit("leave", selectedRestaurant.id);
      socket.off("new-order", handleNewOrder);
    };
  }, [selectedRestaurant?.id]);

  const handleComplete = async (orderId) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/orders/${orderId}/complete`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, status: "completed" } : order
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        🧑‍🍳 Quản lý đơn hàng
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Chọn nhà hàng:</label>
        <select
          className="border px-3 py-2 rounded w-full"
          onChange={(e) =>
            setSelectedRestaurant(
              restaurants.find((r) => r.id === e.target.value)
            )
          }
        >
          <option value="">-- Chọn nhà hàng --</option>
          {restaurants.map((res) => (
            <option key={res.id} value={res.id}>
              {res.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRestaurant && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            📦 Đơn hàng của {selectedRestaurant.name}
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-600">Không có đơn hàng nào.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="p-4 border rounded mb-4 shadow">
                <h2 className="font-semibold">
                  👤 {order.customerId?.fullName}
                </h2>
                <ul className="list-disc list-inside">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity} -{" "}
                      {(item.price * item.quantity).toLocaleString()}đ
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-right text-blue-600 font-semibold">
                  Tổng: {order.total.toLocaleString()}đ
                </p>
                <div className="mt-2 text-sm">
                  Trạng thái:{" "}
                  <span
                    className={
                      order.status === "completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.status === "completed"
                      ? "Đã hoàn tất"
                      : "Đang chuẩn bị"}
                  </span>
                </div>

                {order.status !== "completed" && (
                  <button
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleComplete(order._id)}
                  >
                    ✅ Đánh dấu hoàn tất
                  </button>
                )}

                <button
                  className="mt-2 ml-4 text-sm text-blue-600 hover:underline"
                  onClick={() => setSelectedOrder(order._id)}
                >
                  💬 Chat với khách hàng
                </button>
              </div>
            ))
          )}

          <FloatingChat
            selectedOrder={selectedOrder}
            user={user}
            onClose={() => setSelectedOrder(null)}
          />
        </>
      )}
    </div>
  );
};

export default AdminPage;
