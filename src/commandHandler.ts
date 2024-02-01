import { Client, SlashCommandBuilder } from "discord.js"
import registerCommands from "./registerCommands.js"
import getAllFiles from "./utils/getAllFiles.js"

export default async(client: Client) => {
    try {
        if (!process.env.INDEX_FILE) return console.error('INDEX_FILE environment variable not set.')
        const INDEX_FILE_FOLDER = process.env.INDEX_FILE.split('/')[0]
        const commandFiles = getAllFiles(`${INDEX_FILE_FOLDER}/commands`)
        if (!commandFiles) return console.error('No command files found.')

        const importedModules: { slashCommand: SlashCommandBuilder, callback: Function }[] = []
        for (const commandFile of commandFiles) {
            console.log(`Importing ${commandFile}`)
            importedModules.push((await import(`./${commandFile.split(`${INDEX_FILE_FOLDER}/`)[1]}`)).default)
        }
        await registerCommands(importedModules.map(module => module.slashCommand), client)
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return
            const importedModule = importedModules.find(importedModule => importedModule.slashCommand.name === interaction.commandName)
            importedModule?.callback(client, interaction)
        })
    } catch (error) {
        console.error('Command handler error: ' + error)
    }
}