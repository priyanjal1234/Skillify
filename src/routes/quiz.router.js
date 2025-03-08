import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isInstructor from '../middlewares/isInstructor.js'
import { createQuiz, getLessonQuiz } from '../controllers/quiz.controller.js'
import asyncHandler from '../utils/asyncHandler.js'
const router = express.Router()

router.route("/create/:lessonId").post(isLoggedin,isInstructor,asyncHandler(createQuiz))

router.route("/:lessonId").get(isLoggedin,asyncHandler(getLessonQuiz))

export default router