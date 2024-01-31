import { REST, Routes, Client } from 'discord.js'
import 'dotenv/config'

export default async(commands: Object[], client: Client) => {
    try {
        if (!process.env.TOKEN) return console.error('TOKEN not found in .env file.')
        if (!process.env.CLIENT_ID) return console.error('CLIENT_ID not found in .env file.')
        if (!process.env.GUILD_ID) return console.error('GUILD_ID not found in .env file.')
        // const CLIENT_ID = process.env.CLIENT_ID
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)
        console.log('Registering slash commands...')
        if (process.env.NODE_ENV === 'development') {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            )
        }
        else if (process.env.NODE_ENV === 'production') {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            )
        }
        console.log('Slash commands were registered successfully as: ' + process.env.NODE_ENV)
    } catch (error) {
        console.error('Register commands error: ' + error)
    }
}