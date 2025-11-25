import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });

    // verify user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user from database
    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
