import { Schema, model } from "mongoose"

const userSchema = new Schema({
    legibleData: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    minutes: {
        type: Number,
        default: 1
    }
})

export default model('User', userSchema)