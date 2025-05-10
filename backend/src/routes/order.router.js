import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import { createOrder, verifyPayment } from '../controllers/order.controller.js'
import asyncHandler from '../utils/asyncHandler.js'
const router = express.Router()

router.route("/create-order").post(isLoggedin,asyncHandler(createOrder))

router.route("/verify-payment/:courseId").post(isLoggedin,asyncHandler(verifyPayment))

export default router