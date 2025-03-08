import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import {  getReceiverChats, getSenderChats, getUnreadChats } from '../controllers/chat.controller.js'
import asyncHandler from '../utils/asyncHandler.js'
const router = express.Router()

router.route("/:senderId/:receiverId").get(isLoggedin,asyncHandler(getSenderChats))

router.route("/unread").get(isLoggedin,asyncHandler(getUnreadChats))

router.route("/:sender").get(isLoggedin,getReceiverChats)

export default router