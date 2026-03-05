import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import RoomList from "../components/RoomList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import "../chat.css";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔹 Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/rooms", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  // 🔹 Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // 🔹 Join Room
  const joinRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]);
    socket.emit("joinRoom", room._id);
  };

  // 🔹 Send Message
  const sendMessage = (content) => {
    if (!currentRoom) return;

    socket.emit("sendMessage", {
      roomId: currentRoom._id,
      userId: user._id,
      content,
    });
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Connectly</h2>
        <RoomList rooms={rooms} joinRoom={joinRoom} />
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {currentRoom ? (
          <>
            <div className="chat-header">
              <h3>{currentRoom.name}</h3>
            </div>

            <MessageList messages={messages} user={user} />

            <MessageInput sendMessage={sendMessage} />
          </>
        ) : (
          <div className="no-room">
            <h3>Select a room to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
