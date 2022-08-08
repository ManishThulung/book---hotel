import ErrorHandler from "../utils/ErrorHandler.js";
import Hotel from "../models/Hotel.js";

// create
export const createHotel = async (req, res, next) => {
  const hotel = new Hotel(req.body);

  if (!hotel) {
    return next(ErrorHandler(404, "Cannot create a hotel"));
  }

  try {
    const savedHotel = await hotel.save();
    res.status(200).json({ success: true, savedHotel });
  } catch (error) {
    next(error);
  }
};

// update
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!hotel) {
      return next(ErrorHandler(404, "Hotel not found!"));
    }

    res.status(200).json({ success: true, hotel });
  } catch (error) {
    next(error);
  }
};

// delete
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete({ _id: req.params.id });
    if (!hotel) {
      return next(ErrorHandler(404, "Cannot create a hotel"));
    }
    res.status(200).json({
      success: true,
      message: "hotel deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// get hotel
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return next(ErrorHandler(404, "User not found!"));
    }
    res.status(200).json({
      success: true,
      hotel,
    });
  } catch (error) {
    next(error);
  }
};

// get all hotels
export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gte: min || 10, $lte: max || 1000 },
    }).limit(req.query.limit);

    if (!hotels) {
      return next(ErrorHandler(404, "Hotels not found!"));
    }

    res.status(200).json({
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

// get all hotels by city name
export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city });
      })
    );

    res.status(200).json({
      list,
    });
  } catch (error) {
    return next(ErrorHandler(404, "Cannot find all hotel"));
  }
};

// get all hotels by type
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "night camp", count: villaCount },
    ]);
  } catch (error) {
    return next(ErrorHandler(404, "Cannot find all hotel"));
  }
};
