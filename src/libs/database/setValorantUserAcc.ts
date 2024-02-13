import ValorantUser from "../../models/ValorantUser"
import { Client } from "discord.js"

export default async (client: Client, userId: string, valorantName: string) => {
    try {
        const valorantUser = await ValorantUser.findOne({ userId: userId })
        if (valorantUser) {
            valorantUser.valorantName = valorantName
            await valorantUser.save()
        }
        else {
            const newUser = new ValorantUser({
                userId: userId,
                valorantName: valorantName
            })
            await newUser.save()
        }
    } catch (error) {
        console.error(`Error saving updated users:\n${error}`)
    }
}