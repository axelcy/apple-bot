import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import path = require('path')
import canvasImage from '../libs/canvasImage'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.ts'))
        .setDescription('Genera una imagen con la información de la cuenta de Valorant.')
        .addStringOption(option => 
            option.setName('cuenta')
                .setDescription('Cuenta de Valorant (nombre#tag)')
                .setRequired(true)
        )
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            const buffer = await canvasImage(interaction.options.get('cuenta')?.value?.toString() || '')
            if (!buffer) return await interaction.reply({ content: `No se encontró la cuenta: ${interaction.options.get('cuenta')?.value?.toString() || ''}`, ephemeral: true })
            await interaction.editReply({ files: [buffer] })
        } catch (error) {
            console.error(`Error en "${path.basename(__filename, '.ts')}.ts": ` + error);
        }
    }
}