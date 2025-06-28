import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const socket = io("http://localhost:5000");

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join", user.id);

    const handleOrderCompleted = (order) => {
      toast.success(
        `🎉 Đơn hàng tại ${order.restaurantName || "nhà hàng"} đã xong!`
      );
    };

    socket.on("order-completed", handleOrderCompleted);

    return () => {
      socket.emit("leave", user.id);
      socket.off("order-completed", handleOrderCompleted);
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
