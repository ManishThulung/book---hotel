import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/User.js";

// update
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!user) {
      return next(ErrorHandler(404, "Cannot create a user"));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(err);
  }
};

// delete
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    if (!user) {
      return next(ErrorHandler(404, "Cannot create a user"));
    }
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(err);
  }
};

// get hotel
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(ErrorHandler(404, "User not found!"));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(ErrorHandler(404, "Hotel not found!"));
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(err);
  }
};
