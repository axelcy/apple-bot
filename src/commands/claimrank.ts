import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')
import setValorantUserAcc from '../libs/database/setValorantUserAcc'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Guarda tu cuenta de Valorant para poder acceder a él con el comando /rank.')
        .addStringOption(option => 
            option.setName('valorantname')
                .setDescription('Tu cuenta de Valorant (nombre#tag).')
                .setRequired(true)
        )
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        const valorantName = interaction.options.get('valorantname')?.value?.toString()
        try {
            await interaction.deferReply() // { ephemeral: true }
            if (!valorantName) return await interaction.editReply('Tenés que ingresar una cuenta de Valorant (nombre#tag)')
            setValorantUserAcc(client, interaction.user.id, valorantName)
            await interaction.editReply(`Tu cuentá de valorant fue registrada como **${valorantName}** !`)
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