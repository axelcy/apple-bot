import { REST, Routes, ApplicationCommandOptionType } from 'discord.js'
import 'dotenv/config'
const commands = [
    {
        name: 'ruleta',
        description: 'Ruleta entre nombres.',
        options: [
            {
                name: 'nombres',
                description: 'Nombres separados por comas.',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
    
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

const registerCommands = async () => {
    try {
        console.log('Registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.log('Error: ' + error)
    }
}

console.clear()
registerCommands()