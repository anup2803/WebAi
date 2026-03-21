import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find existing user
    let user = await User.findOne({ email });

    // Create new user if not found
    if (!user) {
      user = await User.create({ name, email, avatar });
    }

    // Sign JWT correctly (use user._id)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only if using HTTPS
      sameSite: "none", // works for localhost
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: "webserverbackend.onrender.com"
    });

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Google auth error ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Log out error ${error.message}`);
  }
};
