import { Client, SlashCommandBuilder } from "discord.js"
import registerCommands from "../libs/registerCommands.js"
import getAllFiles from "../libs/getAllFiles.js"

export default async (client: Client) => {
    try {
        if (!process.env.INDEX_FILE_FOLDER) return console.error('INDEX_FILE_FOLDER environment variable not set.')
        const commandFiles = getAllFiles(`${process.env.INDEX_FILE_FOLDER}/commands`)
        if (!commandFiles) return console.error('No command files found.')

        const importedModules: { slashCommand: SlashCommandBuilder, callback: Function }[] = []
        for (const commandFile of commandFiles) {
            const commandFileName = commandFile.split(`${process.env.INDEX_FILE_FOLDER}/`)[1]
            console.log(`📥 - Importing: ${commandFileName.split('commands/')[1]}`)
            importedModules.push((await import(`../${commandFileName}`)).default)
        }
        await registerCommands(importedModules.map(module => module.slashCommand), client)
        console.log('✅ - Slash commands were registered successfully as: ' + process.env.NODE_ENV)
        
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return
            const importedModule = importedModules.find(importedModule => importedModule.slashCommand.name === interaction.commandName)
            importedModule?.callback(client, interaction)
        })
    } catch (error) {
        console.error('Command handler error: ' + error)
    }
}