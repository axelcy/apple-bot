import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')
// que este comando muestre los servers en los que está con los ids como en start
// y data que se me ocurra
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