import express from "express";
import authRoutes from "./routes/auth_routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js"
dotenv.config();



const PORT = process.env.PORT || 4000;

const app = express();
app.use("/api/auth", authRoutes);

app.get("/",(req,res) =>{
    res.send("sahghhdxhsgd");
})

app.listen(PORT, () => {
    console.log("Server running on port 4000");
    connectMongoDB();
})