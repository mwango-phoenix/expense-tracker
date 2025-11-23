import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const router = express.Router();
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const profileImage = `https://api.dicebear.com/9.x/identicon/svg?seed=${username}`;
    const newUser = new User({ username, email, password, profileImage });

    await newUser.save();

    const token = generateToken(newUser);

    res
      .status(201)
      .json({
        token,
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profileImage: newUser.profileImage,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", (req, res) => {
  // Login logic here
  res.send("login");
});

export default router;
