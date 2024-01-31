import { REST, Routes } from 'discord.js'
import 'dotenv/config'

export default async(commands) => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
        console.log('Registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log('Slash commands were registered successfully!')
    } catch (error) {
        throw new Error('Register commands error: ' + error)
    }
}