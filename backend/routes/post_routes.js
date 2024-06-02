import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createPost,deletePost,commentOnPost,likeUnlikePost,getAllPosts,getLikedPosts,getFollowingPosts,getUserPosts} from "../controllers/post_controller.js";

const router = express.Router();

router.get('/likedPosts/:id',protectRoute, getLikedPosts);
router.get("/followingPosts", protectRoute, getFollowingPosts);
router.get("/userPosts/:username", protectRoute, getUserPosts);
router.get('/all',protectRoute, getAllPosts);
router.post('/create',protectRoute, createPost);
router.delete('/:id',protectRoute, deletePost);
router.post('/like/:id',protectRoute, likeUnlikePost);
router.post('/comment/:id',protectRoute, commentOnPost);

export default router;