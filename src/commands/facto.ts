import { 
    SlashCommandBuilder, 
    Client, CommandInteraction, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, ActionRowBuilder, 
    EmbedBuilder, 
    GuildMember, 
    ButtonBuilder, 
    ButtonStyle, 
    Interaction 
} from 'discord.js'
import path = require('path')
import { consoleError, messageError } from '../libs/error-handler'
import formatResults from '../libs/formatResults'

const xpAvailableMembers: Set<string> = new Set()

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Crea un facto / sugerencia.')
        .setDMPermission(false)
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            const suggestName = 'facto'
            const modal = new ModalBuilder()
                .setTitle(`Crea un ${suggestName}`)
                .setCustomId(`suggestion-${interaction.user.id}`)

            const textInput = new TextInputBuilder()
                .setCustomId(`suggestion-input`)
                .setLabel(`Escribe tu ${suggestName}`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(150)

            const modalActionRow = new ActionRowBuilder()
                .addComponents(textInput)

            await interaction.showModal(modal)

            const filter = (i: any) => {
                // i.
                return i.customId === `suggestion-${interaction.user.id}`
            }

            const modalInteraction: any = await interaction.awaitModalSubmit({
                filter, time: 1000 * 60 * 5
            }).catch(error => console.log('Time out'))

            await modalInteraction.deferUpdate()

            let suggestionMessage = await interaction.channel?.send(`Creando ${suggestName}...`)

            const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input')

            const suggestionEmbed = new EmbedBuilder()
                .setColor('Random')
                // .setTitle(`Mapa: ${valorantMaps[Math.floor(Math.random() * valorantMaps.length)] || 'Mapa no encontrado'}`)
                .setAuthor({
                    name: `/Facto de ${(interaction.member as GuildMember).nickname || interaction.user.displayName}`,
                    iconURL: interaction.user.displayAvatarURL(({ dynamic: true } as any)),
                })
                .addFields([
                    { name: 'Facto', value: suggestionText },
                    // { name: 'Status', value: 'Pending' },
                    { name: 'Votes', value: formatResults() },
                ])
                .setTimestamp()

            const upvoteButton = new ButtonBuilder()
                .setEmoji('👍')
                // .setLabel('Upvote')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`suggestion.${suggestionMessage?.id}.upvote`)
                

            const downvoteButton = new ButtonBuilder()
                .setEmoji('👎')
                // .setLabel('Downvote')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`suggestion.${suggestionMessage?.id}.downvote`)

            const embedActionRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton)

            suggestionMessage?.edit({
                content: `${interaction.user} Facto creado!`,
                embeds: [suggestionEmbed],
                components: [(embedActionRow as any)]
            })

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