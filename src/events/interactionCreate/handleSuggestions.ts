import { Client, EmbedBuilder, GuildMember, Interaction } from 'discord.js'
import Suggestion from '../../models/Suggestion'
import formatResults from '../../libs/formatResults'
import { consoleError } from '../../libs/error-handler'

export default async (client: Client, interaction: Interaction) => {
    try {
        if (!interaction.isButton() || !interaction.customId) return
        const [type, suggestionId, action] = interaction.customId.split('.')
        if (type !== 'suggestion') return
        if (!type || !suggestionId || !action) return
        await interaction.deferReply({ ephemeral: true })

        const targetSuggestion = await Suggestion.findOne({ suggestionId })
        if (!targetSuggestion) return await interaction.editReply('La sugerencia no existe o ya está cerrada.')
        const targetMessage = await interaction.channel?.messages.fetch(targetSuggestion?.messageId)
        if (!targetMessage?.embeds[0]) return await interaction.editReply('Facto no encontrado.')
        const targetMessageEmbed = targetMessage.embeds[0]

        if (action === 'approve' || action === 'reject') {
            // usuario del servidor
            const author = await interaction.guild?.members.fetch(targetSuggestion.authorId) as GuildMember
            const editedSuggestionEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${author.nickname || author.user.displayName}`,
                    iconURL: author.user.displayAvatarURL(({ dynamic: true } as any)),
                })
                .setFooter({
                    text: '/facto',
                    iconURL: client.user?.displayAvatarURL(({ dynamic: true } as any)),
                })
                .setTimestamp()
            if (targetSuggestion.image) editedSuggestionEmbed.setImage(targetSuggestion.image)

            if (action === 'approve') {
                if (!interaction.memberPermissions?.has('ManageMessages')) {
                    return await interaction.editReply('No tienes permisos para aceptar sugerencias.')
                }
                // targetSuggestion.status = 'approved'
                // await targetSuggestion.save()

                editedSuggestionEmbed.setColor(0x84e660)
                editedSuggestionEmbed.addFields([
                    { name: 'Facto', value: targetSuggestion.content },
                    { name: 'Status', value: '✅ Approved' },
                    { name: 'Votes', value: formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes) },
                ])
                await interaction.editReply('Facto aceptado.')
            }
            else { // reject
                if (!interaction.memberPermissions?.has('ManageMessages')) {
                    return await interaction.editReply('No tienes permisos para rechazar sugerencias.')
                }
                // targetSuggestion.status = 'rejected'
                // await targetSuggestion.save()

                editedSuggestionEmbed.setColor(0xff6161)
                editedSuggestionEmbed.addFields([
                    { name: 'Facto', value: targetSuggestion.content },
                    { name: 'Status', value: '❌ Rejected' },
                    { name: 'Votes', value: formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes) },
                ])
                await interaction.editReply('Facto rechazado.')
            }
            await Suggestion.deleteOne({
                suggestionId: targetSuggestion.suggestionId
            })
            await targetMessage.edit({
                embeds: [editedSuggestionEmbed],
                components: []
            })
        }
        else if (action === 'upvote' || action === 'downvote') {
            const hasVoted = (
                targetSuggestion.upvotes.includes(interaction.user.id) ||
                targetSuggestion.downvotes.includes(interaction.user.id)
            )
            if (hasVoted) return await interaction.editReply('Ya has votado en este facto.')
            if (action === 'upvote') targetSuggestion.upvotes.push(interaction.user.id)
            else targetSuggestion.downvotes.push(interaction.user.id)
            await targetSuggestion.save()
            targetMessageEmbed.fields[2].value = formatResults(targetSuggestion.upvotes, targetSuggestion.downvotes)
            await interaction.editReply('Voto registrado.')
            await targetMessage.edit({ embeds: [targetMessageEmbed] })
        }

    } catch (error) {
        try {
            console.error(consoleError(error, __filename))
        }
        catch (error) {
            // console.error(consoleError(error, __filename))
        }
    }
}

/*

if (action === 'approve') {
                if (!interaction.memberPermissions?.has('ManageMessages')) {
                    return await interaction.editReply('No tienes permisos para aceptar sugerencias.')
                }
                targetSuggestion.status = 'approved'
                await targetSuggestion.save()
                // targetMessageEmbed.data.color = 0x84e660
                
                targetMessageEmbed.fields[1].value = '✅ Approved'
                await interaction.editReply('Sugerencia aceptada.')
                await targetMessage.edit({
                    embeds: [targetMessageEmbed],
                    components: []
                })
            }
            else if (action === 'reject') {
                if (!interaction.memberPermissions?.has('ManageMessages')) {
                    return await interaction.editReply('No tienes permisos para rechazar sugerencias.')
                }
                targetSuggestion.status = 'rejected'
                // targetMessageEmbed.data.color = 0xff6161
                targetMessageEmbed.fields[1].value = '❌ Rejected'
                await targetSuggestion.save()
                await interaction.editReply('Sugerencia aceptada.')
                await targetMessage.edit({
                    embeds: [targetMessageEmbed],
                    components: []
                })
            }

*/