const RoomList = ({ rooms, joinRoom }) => {
  return (
    <div>
      <h3>Rooms</h3>
      {rooms.map((room) => (
        <div
          key={room._id}
          onClick={() => joinRoom(room)}
          style={{ cursor: "pointer" }}
        >
          {room.name}
        </div>
      ))}
    </div>
  );
};

export default RoomList;
