import { Client, Interaction } from 'discord.js'

export default async (client: Client, interaction: Interaction) => {
    try {
        if (!interaction.isButton() || !interaction.customId) return
        const [type, suggestionId, action] = interaction.customId.split('.')
        if (!type || !suggestionId || !action) return
        if (type !== 'suggestion') return

        await interaction.deferReply({ ephemeral: true })

    } catch (error) {
        try {
            // await interaction.editReply(messageError(error, __filename))
        }
        catch (error) {
            // console.error(consoleError(error, __filename))
        }
    }
}