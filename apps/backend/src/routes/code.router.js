import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import { runCode } from '../controllers/code.controller.js'
const router = express.Router()

router.route("/run-code").post(isLoggedin,runCode)

export default router