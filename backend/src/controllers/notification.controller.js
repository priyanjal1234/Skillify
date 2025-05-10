import notificationModel from '../models/notification.model.js';
import userModel from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const getUnreadNotifications = async function (req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let unreadNotifications = await notificationModel.find({
      readBy: { $ne: user._id },
    });
    return res.status(200).json(unreadNotifications);
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error getting notifications'
      )
    );
  }
};

const readNotifications = async function (req, res, next) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    await notificationModel.updateMany(
      { readBy: { $ne: user._id } },
      { $addToSet: { readBy: user._id } }
    );

    return res.status(200).json({ message: 'All Notifications are read' });
  } catch (error) {
    return next(
      new ApiError(
        500,
        error instanceof Error ? error.message : 'Error reading notification'
      )
    );
  }
};

export { getUnreadNotifications, readNotifications };
