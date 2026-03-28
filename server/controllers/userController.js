import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

// ── 1. SIGNUP ──────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
    const { fullname, email, password, bio } = req.body;
    try {
        if (!fullname || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // FIX 1: await User.create so we get the actual document, not a Promise
        const newUser = await User.create({ fullname, email, password: hashedPassword, bio });

        const token = generateToken(newUser._id);

        // FIX 13: strip the password hash before sending to client
        const { password: _pw, ...safeUser } = newUser.toObject();

        res.status(201).json({
            success: true,
            userData: safeUser,
            token,
            message: "Account created successfully",
        });
    } catch (error) {
        console.error("signup error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── 2. LOGIN ───────────────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // FIX 2: check if user exists BEFORE calling bcrypt (avoids null crash)
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        // FIX 13: strip password hash from login response
        const { password: _pw, ...safeUser } = userData.toObject();

        res.status(200).json({
            success: true,
            userData: safeUser,
            token,
            message: "Login successful",
        });
    } catch (error) {
        console.error("login error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── 3. CHECK AUTH ──────────────────────────────────────────────────────────
export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};

// ── 4. UPDATE PROFILE ──────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullname } = req.body;
        const userId = req.user._id;

        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullname },
                { new: true }
            ).select("-password");
        } else {
            console.log("uploading to cloudinary..");
            const upload = await cloudinary.uploader.upload(profilePic);
            console.log("updated success", upload.secure_url)
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullname },
                { new: true }
            ).select("-password");
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
         console.log("Error:", error);
        //console.error("updateProfile error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};