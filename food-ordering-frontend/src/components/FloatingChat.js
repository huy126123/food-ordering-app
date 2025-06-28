import { useState } from "react";
import ChatBox from "./ChatBox";

const FloatingChat = ({ selectedOrder, user, onClose }) => {
  const [minimized, setMinimized] = useState(false);

  if (!selectedOrder) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700"
          onClick={() => alert("Vui lòng chọn một đơn hàng để chat")}
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[350px] max-w-[90%] shadow-lg">
      <div className="bg-white border rounded-t-lg flex justify-between items-center p-2">
        <h3 className="font-semibold text-sm truncate">
          💬 Đơn hàng: {selectedOrder}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {minimized ? "🔼" : "🔽"}
          </button>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded"
          >
            ✖
          </button>
        </div>
      </div>
      {!minimized && (
        <div className="border-t rounded-b-lg bg-white">
          <ChatBox orderId={selectedOrder} currentUser={user} />
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
