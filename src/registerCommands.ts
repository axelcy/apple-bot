import { REST, Routes, Client } from 'discord.js'
import 'dotenv/config'
import consoleAnimation from './utils/consoleAnimation'

export default async (commands: Object[], client: Client) => {
    try {
        if (!process.env.TOKEN) return console.error('TOKEN not found in .env file.')
        if (!process.env.CLIENT_ID) return console.error('CLIENT_ID not found in .env file.')
        if (!process.env.GUILD_ID) return console.error('GUILD_ID not found in .env file.')
        const rest = new REST().setToken(process.env.TOKEN)
    
        console.log(`Registering slash commands...`)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log('Slash commands were registered successfully as: ' + process.env.NODE_ENV)

    } catch (error) {
        console.error('Register commands error: ' + error)
    }
}