import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isInstructor from '../middlewares/isInstructor.js'
import { createQuiz, getLessonQuiz } from '../controllers/quiz.controller.js'
const router = express.Router()

router.route("/create/:lessonId").post(isLoggedin,isInstructor,createQuiz)

router.route("/:lessonId").get(isLoggedin,getLessonQuiz)

export default router