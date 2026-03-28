import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes — validates JWT and attaches user to req
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("protectRoute error:", error.message);
        // Differentiate expired token from other errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        res.status(401).json({ success: false, message: "Not authorized" });
    }
};
