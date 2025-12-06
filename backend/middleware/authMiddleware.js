import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "access denied. no Token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error : ", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    // Check if token exists
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user role is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = decoded; // attach decoded data for further use
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
