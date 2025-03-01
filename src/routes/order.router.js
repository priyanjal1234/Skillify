import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import { createOrder, verifyPayment } from '../controllers/order.controller.js'
const router = express.Router()

router.route("/create-order").post(isLoggedin,createOrder)

router.route("/verify-payment/:courseId").post(isLoggedin,verifyPayment)

export default router