import { REST, Routes, Client } from 'discord.js'
import 'dotenv/config'

export default async(commands: Object[], client: Client) => {
    try {
        if (!process.env.TOKEN) return console.error('TOKEN not found in .env file.')
        if (!process.env.CLIENT_ID) return console.error('CLIENT_ID not found in .env file.')
        const CLIENT_ID = process.env.CLIENT_ID
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
        console.log('Registering slash commands...')
        client.guilds.cache.map(async(guild) => 
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guild.id), // process.env.GUILD_ID
                { body: commands }
            )
        )
        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.error('Register commands error: ' + error)
    }
}