import Message from "../models/Messages.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// ── Get all users for sidebar (excluding logged-in user) ───────────────────
export const getUsersforSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        // FIX 14: single aggregation instead of N queries (N+1 fix)
        const unseenCounts = await Message.aggregate([
            { $match: { recieverId: userId, seen: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } },
        ]);

        const unseenMessages = {};
        unseenCounts.forEach(({ _id, count }) => {
            unseenMessages[_id.toString()] = count;
        });

        res.status(200).json({ success: true, filterUsers: filteredUsers, unseenMessages });
    } catch (error) {
        console.error("getUsersforSidebar error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Get messages between logged-in user and selected user ──────────────────
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: selectedUserId },
                { senderId: selectedUserId, recieverId: myId },
            ],
        });

        // Mark incoming messages as seen
        await Message.updateMany(
            { senderId: selectedUserId, recieverId: myId },
            { seen: true }
        );

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("getMessages error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Mark a single message as seen ─────────────────────────────────────────
export const markMessagesasSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("markMessagesasSeen error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── Send a message ─────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });

        // Emit message to receiver's socket if they are online
        const receiverSocketId = userSocketMap[recieverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ success: true, newMessage });
    } catch (error) {
        console.error("sendMessage error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};