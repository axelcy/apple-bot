import { REST, Routes, Client } from 'discord.js'
import 'dotenv/config'

export default async (commands: Object[], client: Client) => {
    try {
        if (!process.env.TOKEN) return console.error('TOKEN not found in .env file.')
        if (!process.env.CLIENT_ID) return console.error('CLIENT_ID not found in .env file.')
        const rest = new REST().setToken(process.env.TOKEN)
    
        const CLIENT_ID = process.env.CLIENT_ID
        if (process.env.NODE_ENV === 'production') {
            try {
                await Promise.all(client.guilds.cache.map(async guild => {
                    await rest.put(
                        Routes.applicationGuildCommands(CLIENT_ID, guild.id),
                        { body: commands }
                    )
                }))
            }
            catch (error) {
                console.error('Register commands error on production: ' + error)
            }
        }
        else {
            if (!process.env.GUILD_ID) return console.error('GUILD_ID not found in .env file.')
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            )
        }

    } catch (error) {
        console.error('Register commands error: ' + error)
    }
}