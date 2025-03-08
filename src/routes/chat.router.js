import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import { getSenderChats, getUnreadChats } from '../controllers/chat.controller.js'
const router = express.Router()

router.route("/:senderId/:receiverId").get(isLoggedin,getSenderChats)

router.route("/unread").get(isLoggedin,getUnreadChats)

export default router