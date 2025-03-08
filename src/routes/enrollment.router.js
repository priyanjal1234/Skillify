import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isInstructor from '../middlewares/isInstructor.js'
import { getEnrolledStudents } from '../controllers/enrollment.controller.js'
import asyncHandler from '../utils/asyncHandler.js'
const router = express.Router()

router.route("/students").get(isLoggedin,isInstructor,asyncHandler(getEnrolledStudents))

export default router