import User from "../models/User.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

// register
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// login
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "Please enter valid credentials"));
    }

    const isPasswordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatched) {
      return next(errorHandler(404, "Please enter valid credentials"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    const { password, isAdmin, ...otherDetails } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        token,
        ...otherDetails,
      });
  } catch (error) {
    next(error);
  }
};
