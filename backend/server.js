import express, { urlencoded } from "express";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import postRoutes from "./routes/post_routes.js";
import notificationRoutes from "./routes/notification_routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
import path from "path";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if(process.env.NODE_ENV === "production"){
   app.use(express.static(path.join(__dirname,"/frontend/dist")));

   app.get("*", (req,res) => {
       res.sendFile(path.resolve(__dirname, "frontend","dist", "index.html"));
   });
}

app.listen(PORT, () => {
    console.log("Server running on port 4000");
    connectMongoDB();
})