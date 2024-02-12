import mongoose from "mongoose"
import Minutes from '../../models/Minutes'
import { Client } from "discord.js"
import calculateLevel from "../calculateLevel"
import 'dotenv/config'

export default async (client: Client, memberId: string, guildId: string) => {
    if (!process.env.MONGODB_URI) return console.error("MONGODB_URI is not defined in .env file.")
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const minutes = await Minutes.findOne({ userId: memberId, guildId: guildId })
        const MINUTES_TO_LEVEL_UP = 15
        if (minutes) {
            minutes.minutes += 1
            const actualLevel = calculateLevel(minutes.minutes, MINUTES_TO_LEVEL_UP)
            if (minutes.level !== actualLevel) minutes.level = actualLevel
            await minutes.save()
        }
        else {
            // obtener usuario por id
            const { tag } = client.users.cache.get(memberId) || { tag: undefined }
            const { name } = client.guilds.cache.get(guildId) || { name: undefined }
            // añadir nivel, cada nivel debería ser 15 minutos + 15 minutos por cada nivel
            // que todos empiecen en lvl0, y que para subir a lvl1 se necesiten 15 minutos
            const newMinutes = new Minutes({
                userId: memberId,
                guildId: guildId,
                minutes: 1,
                legibleData: `${tag} - ${name}`
            })
            await newMinutes.save()
        }
        // await mongoose.connection.close()
    } catch (error) {
        console.error(`Error saving updated minutes:\n${error}`)
        // await mongoose.connection.close()
        // .catch(error => console.error(`Error closing connection:\n${error}`))
    }
}