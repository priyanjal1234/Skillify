import jwt from 'jsonwebtoken'
import { jwtKey } from '../constants.js'

function generateToken(name,email) {
    return jwt.sign({name,email},jwtKey)
}

export default generateToken