import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Muestra el ping del bot.')
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            const reply = await interaction.fetchReply()
            const ping = reply.createdTimestamp - interaction.createdTimestamp
            await interaction.editReply(`🏓 Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`)
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