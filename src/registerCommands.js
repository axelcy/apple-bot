import { REST, Routes } from 'discord.js'
import 'dotenv/config'

export default async(commands, client) => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
        console.log('Registering slash commands...')
        client.guilds.cache.map(async(guild) => 
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), // process.env.GUILD_ID
                { body: commands }
            )
        )
        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.error('Register commands error: ' + error)
    }
}