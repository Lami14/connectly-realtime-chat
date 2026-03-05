import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import RoomList from "../components/RoomList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await axios.get("/rooms", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setRooms(data);
    };
    fetchRooms();
  }, [user]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const joinRoom = (room) => {
    setCurrentRoom(room);
    setMessages([]);
    socket.emit("joinRoom", room._id);
  };

  const sendMessage = (content) => {
    socket.emit("sendMessage", {
      roomId: currentRoom._id,
      userId: user._id,
      content,
    });
  };

  return (
    <div style={{ display: "flex" }}>
      <RoomList rooms={rooms} joinRoom={joinRoom} />
      <div>
        <MessageList messages={messages} />
        {currentRoom && (
          <MessageInput sendMessage={sendMessage} />
        )}
      </div>
    </div>
  );
};

export default Chat;
