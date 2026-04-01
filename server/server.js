import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Same-origin in production (frontend served by this server), so no CORS needed.
// In dev, allow Vite dev server on port 5173.
const allowedOrigin =
    process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production"
        ? false               // same-origin — no CORS header needed
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

// ── Serve Frontend ───────────────────────────────────────────────────────────
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('*name', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// ── Start Server ───────────────────────────────────────────────────────────
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));