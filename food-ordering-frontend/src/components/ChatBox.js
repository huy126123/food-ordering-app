import { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import axios from "axios";

const ChatBox = ({ orderId, currentUser }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const prevOrderIdRef = useRef(null);

  useEffect(() => {
    if (!orderId || !currentUser?.id) return;

    const prevOrderId = prevOrderIdRef.current;

    if (prevOrderId && prevOrderId !== orderId) {
      socket.emit("leave", prevOrderId);
    }

    socket.emit("join-order", orderId);

    prevOrderIdRef.current = orderId;

    axios
      .get(`${process.env.REACT_APP_API_URL}/messages/${orderId}`)
      .then((res) => setMessages(res.data))
      .catch(() => alert("Lỗi khi load tin nhắn"));

    const handleReceive = (msg) => {
      console.log("💬 New message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [orderId, currentUser?.id]);

  const handleSend = () => {
    if (content.trim()) {
      socket.emit("send-message", {
        orderId,
        senderId: currentUser.id,
        content,
      });
      setContent("");
    }
  };

  return (
    <div className="border rounded p-3 bg-white max-w-lg mx-auto">
      <div className="h-60 overflow-y-auto border-b mb-2 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-1 p-2 rounded text-sm max-w-[80%] break-words ${
              msg.senderId === currentUser.id
                ? "bg-blue-100 text-right ml-auto"
                : "bg-gray-200 text-left mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 px-2 py-1 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
