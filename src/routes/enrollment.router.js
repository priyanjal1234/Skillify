import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isInstructor from '../middlewares/isInstructor.js'
import { getEnrolledStudents } from '../controllers/enrollment.controller.js'
const router = express.Router()

router.route("/students").get(isLoggedin,isInstructor,getEnrolledStudents)

export default router