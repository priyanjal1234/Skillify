import express from 'express';
import { getUnreadNotifications, readNotifications } from '../controllers/notification.controller.js';
import isLoggedin from '../middlewares/isLoggedin.js';
const router = express.Router();

router.route('/unread-notifications').get(isLoggedin, getUnreadNotifications);

router.route("/mark-read").put(isLoggedin,readNotifications)

export default router;
