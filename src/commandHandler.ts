import { Client, SlashCommandBuilder } from "discord.js"
import registerCommands from "./registerCommands.js"
import getAllFiles from "./utils/getAllFiles.js"

export default async(client: Client) => {
    try {
        const commandFiles = getAllFiles('src/commands')
        // const importedModules: { name: string, callback: Function }[] = []
        const importedModules: { slashCommand: SlashCommandBuilder, callback: Function }[] = []
        for (const commandFile of commandFiles) {
            importedModules.push((await import(`./${commandFile.split('src/')[1]}`)).default)
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