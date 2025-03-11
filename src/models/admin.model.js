import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    }
})

const adminModel = mongoose.model("admin",adminSchema)

export default adminModel