import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import { getReceiverChats, getSenderChats } from '../controllers/chat.controller.js'
const router = express.Router()

router.route("/:senderId/:receiverId").get(isLoggedin,getSenderChats)

router.route("/:receiverId").get(isLoggedin,getReceiverChats)

export default router