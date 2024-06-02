import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getNotifications,delNotifications } from '../controllers/notification_controller.js';

const router = express.Router();

router.get('/',protectRoute, getNotifications);
router.delete('/',protectRoute, delNotifications);

export default router;