import express from 'express'
import isLoggedin from '../middlewares/isLoggedin.js'
import isAdmin from '../middlewares/isAdmin.js'
const router = express.Router()

router.route("/get-dashboard-details").get(isLoggedin,isAdmin)

export default router