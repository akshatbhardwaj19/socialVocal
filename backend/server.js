import express, { urlencoded } from "express";
import authRoutes from "./routes/auth_routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/",(req,res) =>{
    res.send("sahghhdxhsgd");
})

app.listen(PORT, () => {
    console.log("Server running on port 4000");
    connectMongoDB();
})