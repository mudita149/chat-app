import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

console.log("=== Cloudinary Credential Check ===");
console.log("CLOUD_NAME  :", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY     :", process.env.CLOUDINARY_API_KEY);
console.log("SECRET len  :", process.env.CLOUDINARY_API_SECRET?.length);
console.log("SECRET first4:", process.env.CLOUDINARY_API_SECRET?.substring(0, 4));
console.log("SECRET last4 :", process.env.CLOUDINARY_API_SECRET?.slice(-4));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a tiny 1x1 red pixel PNG (no file needed)
const tinyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

console.log("\nAttempting Cloudinary upload...");
try {
    const result = await cloudinary.uploader.upload(tinyBase64);
    console.log("✅ SUCCESS! URL:", result.secure_url);
} catch (err) {
    console.error("❌ FAILED:", err.message);
    console.error("HTTP code:", err.http_code);
    console.error("Full error:", err);
}
