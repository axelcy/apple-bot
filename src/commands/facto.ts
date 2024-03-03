import {
    SlashCommandBuilder,
    Client,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle, ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    ButtonBuilder,
    ButtonStyle,
    Message,
    ModalSubmitInteraction
} from 'discord.js'
import path = require('path')
import { consoleError, messageError } from '../libs/error-handler'
import formatResults from '../libs/formatResults'
import Suggestion from '../models/Suggestion'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Crea un facto / sugerencia.')
        .setDMPermission(false)
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        let suggestionMessage
        try {
            const suggestionName = 'facto'

            const modal = new ModalBuilder()
                .setTitle(`Crea un ${suggestionName}`)
                .setCustomId(`suggestion-${interaction.user.id}`)

            const textInput = new TextInputBuilder()
                .setCustomId(`suggestion-input`)
                .setLabel(`Escribe tu ${suggestionName}`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(500)

            const imageUrlInput = new TextInputBuilder()
                .setCustomId(`suggestion-image`)
                .setLabel(`Enlace foto ${suggestionName}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(4000)

            const modalFirstActionRow = new ActionRowBuilder().addComponents(textInput)
            const modalSecondActionRow = new ActionRowBuilder().addComponents(imageUrlInput)

            modal.addComponents(
                modalFirstActionRow as any,
                modalSecondActionRow as any
            )

            await interaction.showModal(modal)

            const filter = (i: any) => i.customId === `suggestion-${interaction.user.id}`

            const modalInteraction = await interaction.awaitModalSubmit({
                filter, time: 1000 * 60 * 5
            }) as ModalSubmitInteraction
            // .catch(error => console.log('Time out'))

            await modalInteraction.deferReply({ ephemeral: true })

            try {
                suggestionMessage = await interaction.channel?.send(`Creando ${suggestionName}...`) as Message
            }
            catch (error) {
                modalInteraction.editReply('Error al crear el mensaje.')
            }
            if (!suggestionMessage?.id) return modalInteraction.editReply('Error al crear el mensaje.')
            const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-input')
            let suggestionImage: string | undefined = modalInteraction.fields.getTextInputValue('suggestion-image')
            const suggestionStringIsImage: boolean = suggestionImage?.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/) != null

            const newSuggestion = new Suggestion({
                authorId: interaction.user.id,
                guildId: interaction.guildId,
                messageId: suggestionMessage.id,
                content: suggestionText,
                image: suggestionStringIsImage ? suggestionImage : undefined
            })
            // await newSuggestion.save()

            modalInteraction.editReply(`${suggestionName} creado!`)

            const suggestionEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${(interaction.member as GuildMember).nickname || interaction.user.displayName}`,
                    iconURL: interaction.user.displayAvatarURL(({ dynamic: true } as any)),
                })
                .addFields([
                    { name: 'Facto', value: suggestionText },
                    { name: 'Status', value: '⏳ Pending' },
                    { name: 'Votes', value: formatResults() },
                ])
                .setColor('Yellow')
                .setFooter({
                    text: '/facto',
                    iconURL: client.user?.displayAvatarURL(({ dynamic: true } as any)),
                })
                .setTimestamp()
            if (suggestionImage.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/) != null) suggestionEmbed.setImage(suggestionImage)

            const upvoteButton = new ButtonBuilder()
                .setEmoji('👍')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`)

            const downvoteButton = new ButtonBuilder()
                .setEmoji('👎')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`)

            const approveButton = new ButtonBuilder()
                .setEmoji('✅')
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`)

            const rejectButton = new ButtonBuilder()
                .setEmoji('🗑️')
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`)

            const embedFirstActionRow = new ActionRowBuilder().addComponents(
                upvoteButton, downvoteButton, approveButton, rejectButton
            )
            // const embedSecondActionRow = new ActionRowBuilder().addComponents(approveButton, rejectButton)

            await newSuggestion.save()
            suggestionMessage?.edit({
                // content: `${interaction.user} Facto creado!`,
                content: null,
                embeds: [suggestionEmbed],
                components: [(embedFirstActionRow as any)]
            })

        } catch (error) {
            try {
                await interaction.editReply(messageError(error, __filename))
                await suggestionMessage?.edit({
                    content: 'Error al crear el mensaje.',
                })
                // console.error(consoleError(error, __filename))
            }
            catch (error) {
                // console.error(consoleError(error, __filename))
            }
        }
    }
}