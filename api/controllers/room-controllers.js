import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const room = new Room(req.body);
  try {
    await room.save();

    try {
      await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: room._id } });
    } catch (error) {
      next(error);
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// update
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!room) {
      return next(ErrorHandler(404, "Room not found!"));
    }
    res.status(200).json({ success: true, room });
  } catch (error) {
    next(err);
  }
};

// update room availability
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json({
      success: true,
      message: "Room status has been changed",
    });
  } catch (error) {
    next(err);
  }
};

// delete
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;

  try {
    const room = await Room.findByIdAndDelete({ _id: req.params.id });
    if (!room) {
      return next(ErrorHandler(404, "Cannot delete a room"));
    }
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      next(error);
    }

    res.status(200).json({
      success: true,
      message: "room deleted successfully",
    });
  } catch (error) {
    next(err);
  }
};

// get room
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return next(ErrorHandler(404, "Room not found!"));
    }
    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(err);
  }
};

// room
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();

    if (!rooms) {
      return next(ErrorHandler(404, "Hotel not found!"));
    }

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(err);
  }
};
