import User from "../models/user_model.js";
import Notification from "../models/notification_model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";

export const getUserProfile = async (req,res) =>{
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if(!user) return  res.status(404).json({error: "User not found"});
        
        res.status(200).json(user);

    } catch (error) {
        console.log(`Error in getUserProfile: ${error.message}`);
        res.status(500).json({error: error.message});
    }
};

export const followUnfollowUser = async (req,res) =>{
    const {id} = req.params;

    try {
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        
        if(id === req.user._id.toString()) return res.status(400).json({error: "You can't follow or unfollow yourself"});
        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(id,{ $pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{ $pull: {following: id}});
            res.status(200).json({message: "User unfollowed sucessfully"});
        }
        else{
           await User.findByIdAndUpdate(id,{ $push: {followers: req.user._id}});
           await User.findByIdAndUpdate(req.user._id,{ $push: {following: id}});

           const newNotification = new Notification({
                type: "follow",
                to: req.user._id,
                from: id,
           });

           await newNotification.save();
           res.status(200).json({message: "User followed sucessfully"});
        }
    } catch (error) {
        console.log(`Error in followUnfollowUser: ${error.message}`);
        res.status(500).json({error: error.message});
    }
} ;

export const getSuggestedUsers = async (req,res) => {
     try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");
         
        const users = await User.aggregate([
            {
              $match:{
                _id: {$ne: userId}
              }
            },
            { $sample: {size:10} }
        ]);

        const filteredUsers = users.filter((item) => !usersFollowedByMe.following.includes(item._id));
        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach((user) => (user.password=null))
        res.status(200).json(suggestedUsers);

     } catch (error) {
        console.log(`Error in getSuggestedUsers: ${error.message}`);
        res.status(500).json({error: error.message});
     }
};

export const updateUser = async(req,res) =>{
    const {fullName,email,username,currentPassword,newPassword,bio,link} = req.body;
    let {coverImg,profileImg} = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if( (!currentPassword && newPassword) || (currentPassword && !newPassword))
            return res.status(400).json({error: "Please provide both current and new password"});
        
        if(currentPassword && newPassword){
           const isMatch = await bcrypt.compare(currentPassword,user.password);
           if(!isMatch) return res.status(400).json({error: "Current password is incorrect"});
           if(newPassword.length<6) return res.status(400).json({error: "Password must be atleast 6 characters long"});
           
           const salt = await bcrypt.genSalt(10);
           user.password = await bcrypt.hash(newPassword,salt);
        }

        if(profileImg){
           if(user.profileImg){
              //destroying prev img from cloudinary if already exists
              // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
              // we are extracting id:zmxorcxexpdbh8r0bkjb to destroy.
              await cloudinary.destroy(user.profileImg.split('/').pop().split('.')[0])
           } 

           //uploading new img
           const uploadedResponse = await cloudinary.uploader.upload(profileImg);
           profileImg = uploadedResponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.destroy(user.coverImg.split('/').pop().split('.')[0])
             } 
  
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.email = email || user.email;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        
        // password should be null in response(password not updated in db as we do not save).
        user.password = null;
        res.status(200).json(user);

    } catch (error) {
        console.log(`Error in updateUser: ${error.message}`);
        res.status(500).json({error: error.message});
    }
}