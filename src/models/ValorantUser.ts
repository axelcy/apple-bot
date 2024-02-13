import { Schema, model } from "mongoose"

const valorantUserSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    valorantName: {
        type: String,
        required: true
    },
})

export default model('ValorantUser', valorantUserSchema)