import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

function assignJwtToken(req, res, user, responseMessage) {
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ success: true, message: responseMessage });
}

export const RegisterController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isuserExist = await User.findOne({ email });
    if (isuserExist) {
      return res.status(201).json({ message: "User exist ! Login instead" });
    } else {
      const user = new User({ username, email, password });
      await user.save();
      assignJwtToken(req, res, user, "Registration successful");
    }
  } catch (error) {
    res.status(500).json({
      error: { message: "Internal server error ", detailed: error.message },
    });
    console.log(error.message);
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User doesn't exist! Register first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    assignJwtToken(req, res, user, "Login successful");
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Internal server error in Login",
        detailed: error.message,
      },
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    res.status(200).json({
      message: "User authenticated",
      user: {
        username: req.user.username,
        userId,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "logged out !!" });
};
