import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra el ping del bot.')
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            const reply = await interaction.fetchReply()
            const ping = reply.createdTimestamp - interaction.createdTimestamp
            await interaction.editReply(`🏓 Pong! Client: ${ping}ms | Websocket: ${client.ws.ping}ms`)
        } catch (error) {
            console.error('Error en "ping.js": ' + error)
        }
    }
}