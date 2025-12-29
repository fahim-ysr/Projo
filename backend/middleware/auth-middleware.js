// Middleware to authenticatee requests using JWT

import { jwt } from "jsonwebtoken";
import User from "../models/user";

// Checks for a valid JWT token in Authorization header
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Verifies the token and finds the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log(user);

    req.user = user; // Attaches user to request
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
