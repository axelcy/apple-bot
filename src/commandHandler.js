import registerCommands from "./registerCommands.js"
import getAllFiles from "./utils/getAllFiles.js"

export default async(client) => {
    try {
        const commandFiles = getAllFiles('src/commands')
        const importedModules = []
        for (const commandFile of commandFiles) {
            importedModules.push((await import(`./${commandFile.split('src/')[1]}`)).default)
        }
        await registerCommands(importedModules)
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return
            const importedModule = importedModules.find(importedModule => importedModule.name === interaction.commandName)
            importedModule.callback(interaction)
        })
    } catch (error) {
        throw new Error('Command handler error: ' + error)
    }
}