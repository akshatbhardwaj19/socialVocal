import express from "express";
import {signup,login,logout} from "../controllers/auth_controller.js";

const router = express.Router();

router.post("/signup" , signup);
router.post("/signup" , login);
router.post("/signup" , logout);

export default router;