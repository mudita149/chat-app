import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
    getMessages,
    getUsersforSidebar,
    markMessagesasSeen,
    sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersforSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessagesasSeen); // FIX 3: added leading "/"
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
