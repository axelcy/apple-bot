import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import path = require('path')

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Emojis de monocuilo con copita de vino. y topos')
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            await interaction.editReply('Identifico a keisis como: 🧐🧐🍷🍷🐭🐭')
        } catch (error) {
            console.error(`Error en "${path.basename(__filename, path.extname(__filename))}${path.extname(__filename)}": ` + error)
        }
    }
}


