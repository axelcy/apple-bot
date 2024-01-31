import { ApplicationCommandOptionType } from 'discord.js'

export default {
    name: 'saludar',
    description: 'Prueba de comando modulo.',
    callback: async (interaction) => {
        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        try {
            if (!interaction.isChatInputCommand()) return
            await interaction.deferReply()
            await interaction.editReply('Hola')

        } catch (error) {
            console.error('Error en "saludar.js": ' + error)
        }
    }
}