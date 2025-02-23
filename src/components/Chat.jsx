import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-300 rounded-lg shadow-lg bg-white text-gray-900 p-4 h-[80vh] flex flex-col">
      <h1 className="text-xl font-semibold text-center pb-4 border-b border-gray-300">Chat</h1>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header text-gray-500 text-sm">
              {`${msg.firstName} ${msg.lastName}`}
            </div>
            <div className="chat-bubble bg-gray-500 text-white px-4 py-2 shadow-md">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center border-t border-gray-300 p-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered w-full text-gray-900 rounded-lg px-4 py-2"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="btn btn-primary ml-3">Send</button>
      </div>
    </div>
  );
};

export default Chat;
