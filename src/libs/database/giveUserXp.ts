import mongoose from "mongoose"
import Minutes from '../../models/Minutes'
import { Client } from "discord.js"
import 'dotenv/config'

export default async (client: Client, memberId: string, guildId: string) => {
    if (!process.env.MONGODB_URI) return console.error("MONGODB_URI is not defined in .env file.")
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const minutes = await Minutes.findOne({ userId: memberId, guildId: guildId })
        if (minutes) {
            minutes.minutes += 1
            await minutes.save()
        }
        else {
            // obtener usuario por id
            const { tag } = client.users.cache.get(memberId) || { tag: undefined }
            const { name } = client.guilds.cache.get(guildId) || { name: undefined }
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
        // await mongoose.connection.close().catch(error => console.error(`Error closing connection:\n${error}`))
    }
}