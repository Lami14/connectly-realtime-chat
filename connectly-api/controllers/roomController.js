const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  const { name } = req.body;

  try {
    const room = await Room.create({
      name,
      createdBy: req.user.id,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
