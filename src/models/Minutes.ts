import { Schema, model } from "mongoose"

const minutesSchema = new Schema({
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
        default: 0
    },
    legibleData: {
        type: String,
        required: true
    }
})

export default model('Minutes', minutesSchema)