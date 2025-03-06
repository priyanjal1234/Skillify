import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isInstructor from '../middlewares/isInstructor.js'
import { createQuiz } from '../controllers/quiz.controller.js'
const router = express.Router()

router.route("/create/:lessonId").post(isLoggedin,isInstructor,createQuiz)

export default router