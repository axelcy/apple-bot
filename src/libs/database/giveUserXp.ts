import User from '../../models/User'
import { Client } from "discord.js"
import calculateLevel from "../calculateLevel"

export default async (client: Client, memberId: string, guildId: string) => {
    try {
        if (client.users.cache.get(memberId)?.bot) return
        const user = await User.findOne({ userId: memberId, guildId: guildId })
        if (user) {
            user.minutes += 1
            const actualLevel = calculateLevel(user.minutes)
            if (user.level !== actualLevel.level) user.level = actualLevel.level
            await user.save()
        }
        else {
            const { tag } = client.users.cache.get(memberId) || { tag: undefined }
            const { name } = client.guilds.cache.get(guildId) || { name: undefined }
            const newUser = new User({
                userId: memberId,
                guildId: guildId,
                legibleData: `${tag} - ${name}`
            })
            await newUser.save()
        }
    } catch (error) {
        console.error(`Error saving updated users:\n${error}`)
    }
}