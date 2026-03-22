// middleware/isAuth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token:", token);
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    const user = await User.findById(decoded.id);\
    console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;
