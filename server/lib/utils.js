import jwt from "jsonwebtoken";

// FIX 5: Added expiresIn — tokens were valid forever before this fix
export const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};