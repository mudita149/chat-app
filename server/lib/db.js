import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log("Database Connected"));
        // FIX 4: removed space from DB name ("chat app" → "chatapp")
        await mongoose.connect(`${process.env.MONGODB_URI}/chatapp`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process if DB fails — avoids silent crashes
    }
};