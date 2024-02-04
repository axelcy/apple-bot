import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js'
import path = require('path')

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.ts'))
        .setDescription('Muestra el ping del bot.')
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            const reply = await interaction.fetchReply()
            const ping = reply.createdTimestamp - interaction.createdTimestamp
            await interaction.editReply(`🏓 Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`)
        } catch (error) {
            console.error(`Error en "${path.basename(__filename, '.ts')}.ts": ` + error)
        }
    }
}