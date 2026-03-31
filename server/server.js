import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// FIX 6: Restrict CORS to CLIENT_URL env var in production, localhost in dev
const allowedOrigin =
    process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173";

// ── Socket.IO Setup ────────────────────────────────────────────────────────
export const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true,
    },
});

// Store online users: { userId: socketId }
export const userSocketMap = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // Broadcast updated online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// ── Express Middleware ─────────────────────────────────────────────────────
// FIX 6: cors() now uses the restricted allowedOrigin
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" })); // Base64 inflates size ~33%, so allow headroom

// ── Routes ─────────────────────────────────────────────────────────────────
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ── Start Server ───────────────────────────────────────────────────────────
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));