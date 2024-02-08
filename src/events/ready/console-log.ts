import { Client } from 'discord.js'

export default async (client: Client) => {
    if (!client.isReady()) return
    console.clear()
    console.log(`✅ - ${client.user.tag} is online.`)
    console.log(
        `📊 - On ${client.guilds.cache.size} servers:`, 
        client.guilds.cache.map(guild => `🔍 ${guild.name} (${guild.id})`)
    )
}