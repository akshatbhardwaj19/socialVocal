import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req,res) =>{
   try {
     const {email,username,password,fullname} = req.body;
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if(!emailRegex.test(email)){
        res.status(400).json({error: "Invalid email format"});
     }
     
     const existingUser = await User.findOne({username});
     if(existingUser){
        res.status(400).json({error: "Username already exists"});
     }

     const existingEmail = await User.findOne({email});
     if(existingEmail){
        res.status(400).json({error: "Email is already taken"});
     }

     if(password.length<6){
        res.status(400).json({error: "Password should be of atleast 6 characters"});
     }
     
     const salt = await bcrypt.genSalt(10);
     const hashed = await bcrypt.hash(password,salt);

     const newUser = new User({
        fullname,
        username,
        email,
        password: hashed
     });

     if(newUser){
        generateTokenAndSetCookie(newUser._id,res);  
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            username: newUser.username,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
            followers: newUser.followers,
            following: newUser.following,
        })
     }
     else{
        res.status(400).json({error: "Invalid user data"});
     }
   } catch (error) {
      console.log(`Error in signup controller: ${error.message}`);
      res.status(500).json({error: "Error at server"});
   }
}

export const login = async (req,res) =>{
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect)
           res.status(400).json({error: "Invalid username or password"});  
        
        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            followers: user.followers,
            following: user.following,
        });
    } catch (error) {
        console.log(`Error in login controller: ${error.message}`);
        res.status(500).json({error: "Error at server"});
    }
}

export const logout = async (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({meassage: "Logged out successfully"});
    } catch (error) {
        console.log(`Error in logout controller: ${error.message}`);
        res.status(500).json({error: "Error at server"});
    }
}

export const getMe = async (req,res) =>{
   try {
      const user = await User.findById(req.user._id).select("-password");
      res.status(200).json(user);
   } catch (error) {
      console.log(`Error in getMe controller: ${error.message}`);
      res.status(500).json({error: "Error at server"});
   }
}