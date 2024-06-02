import express, { urlencoded } from "express";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import postRoutes from "./routes/post_routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log("Server running on port 4000");
    connectMongoDB();
})