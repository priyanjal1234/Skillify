import mongoose from "mongoose";
import { mongodbUri } from "../constants.js";

async function db() {
    try {
        let conn = await mongoose.connect(mongodbUri)
        console.log(`Connected to ${conn.connection.host}`)
    } catch (error) {
        if(error instanceof Error) {
            console.log(error.message)
        }
        else {
            console.log("Error Connecting with Database")
        }
    }
}

export default db