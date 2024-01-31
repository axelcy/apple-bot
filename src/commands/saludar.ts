import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName('saludar')
        .setDescription('el apel bot te saluda.')
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            await interaction.editReply('Hola')
        } catch (error) {
            console.error('Error en "saludar.js": ' + error)
        }
    }
}


