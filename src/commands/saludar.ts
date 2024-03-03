import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import path = require('path')
import { consoleError, messageError } from '../libs/error-handler'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('el apel bot te saluda.')
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            await interaction.editReply('Un saludo, humano. 🤖👋🏼')
        } catch (error) {
            try {
                await interaction.editReply(messageError(error, __filename))
            }
            catch (error) {
                console.error(consoleError(error, __filename))
            }
        }
    }
}