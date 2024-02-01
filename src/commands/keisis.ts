import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName('keisis')
        .setDescription('Emojis de monocuilo con copita de vino. y topos')
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            await interaction.editReply('Identifico a keisis como: 🧐🧐🍷🍷🐭🐭')
        } catch (error) {
            console.error('Error en "saludar.js": ' + error)
        }
    }
}


