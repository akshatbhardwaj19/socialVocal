import Notification from "../models/notification_model.js";

export const getNotifications = async(req,res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({to: userId}).populate({
             path: "from",
             select: "uername profileImg"
        });

        await Notification.updateMany({to: userId}, {read: true});
        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}
export const delNotifications = async(req,res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});
        res.status(200).json({meassage: "Notifications deleted successfully"});

    } catch (error) {
         console.log("Error in delNotifications controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}