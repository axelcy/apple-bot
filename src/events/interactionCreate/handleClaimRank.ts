import { Client, EmbedBuilder, GuildMember, Interaction } from 'discord.js'
import Suggestion from '../../models/Suggestion'
import formatResults from '../../libs/formatResults'
import { consoleError } from '../../libs/error-handler'
import 'dotenv/config'
import { developmentRanksRoles } from '../../global/development'
import { productionRanksRoles } from '../../global/production'
import ValorantUser from '../../models/ValorantUser'

export default async (client: Client, interaction: Interaction) => {
    try {
        if (!interaction.isButton() || !interaction.customId) return
        const [type, valorantName, rankToClaim] = interaction.customId.split('.')
        if (type !== 'claimrankrole') return
        if (!type || !valorantName || !rankToClaim) return
        await interaction.deferReply({ ephemeral: true })
        var ranksRoles
        if (process.env.NODE_ENV === 'development') ranksRoles = developmentRanksRoles
        if (process.env.NODE_ENV === 'production') ranksRoles = productionRanksRoles
        if (!ranksRoles) return
        const targetAccount = await ValorantUser.findOne({ userId: interaction.user.id })

        // Si no tiene una cuenta registrada con /claimrank
        if (!targetAccount) return await interaction.editReply('No tenés una cuenta de Valorant registrada, usá el comando **/claimrank** para hacerlo.')
        // Si sí tiene cuenta, pero no es la misma que la que se quiere reclamar
        if (targetAccount.valorantName !== valorantName) return await interaction.editReply('No podés reclamar el rango de una cuenta que no es tuya.')
        // Si la cuenta es la misma, pero ya tiene el rango reclamado
        const guildMember = interaction.member as GuildMember
        if (guildMember.roles.cache.has(ranksRoles[rankToClaim])) return await interaction.editReply('Ya tenés este rango reclamado.')

        // Si la cuenta es la misma y no tiene el rango reclamado
        for (const rank in ranksRoles) {
            if (guildMember.roles.cache.has(ranksRoles[rank])) {
                await guildMember.roles.remove(ranksRoles[rank])
            }
        }
        await guildMember.roles.add(ranksRoles[rankToClaim])
        await interaction.editReply('Rango Registrado :)')
    } catch (error) {
        try {
            console.error(consoleError(error, __filename))
        }
        catch (error) {
            // console.error(consoleError(error, __filename))
        }
    }
}