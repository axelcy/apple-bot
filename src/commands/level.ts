import { SlashCommandBuilder, Client, CommandInteraction, GuildMember, AttachmentBuilder } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')
import User from '../models/User'
import { RankCardBuilder, Font } from 'canvacord'
import calculateLevel from '../libs/calculateLevel'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Muestra tu nivel o el de otro usuario.')
        .addMentionableOption(option =>
            option.setName('usuario')
                .setDescription('Usuario del que quieres ver el nivel.')
                .setRequired(false)
        )
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guild?.id) return interaction.reply('Este comando solo puede ser usado en un servidor.')
            await interaction.deferReply()
            const targetUserId: string = interaction.options.get('usuario')?.value?.toString() || interaction.user.id
            const targetUser: GuildMember = await interaction.guild.members.fetch({ user: targetUserId })

            const dbUser = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id })
            if (!dbUser) return await interaction.editReply(`El usuario **${targetUser.user.tag}** aún no tiene nivel.`)

            let allLevels = await User.find({ guildId: interaction.guild.id }).select('-_id userId minutes')
            allLevels = allLevels.sort((a, b) => b.minutes - a.minutes)
            let currentRank: number = allLevels.findIndex(user => user.userId === targetUserId) + 1 || allLevels.length + 1
            const calculatedLevel = calculateLevel(dbUser.minutes)
            const displayName = {
                days: Math.floor(dbUser.minutes / 60 / 24),
                hours: Math.floor(dbUser.minutes / 60 % 24),
                minutes: dbUser.minutes % 60
            }
            Font.loadDefault()
            const levelCard = new RankCardBuilder()
                .setDisplayName(`${targetUser.user.displayName} - ${displayName.days}d ${displayName.hours}hs y ${displayName.minutes}mins`)
                .setUsername(`XP Total: ${dbUser.minutes} (1 xp = 1 minuto en voz)`)
                .setAvatar(targetUser.user.displayAvatarURL({ size: 256 }).replace('gif','png'))
                .setRank(currentRank)
                .setLevel(calculateLevel(dbUser.minutes).level)
                .setCurrentXP(calculatedLevel.userLevelMinutes)
                .setRequiredXP(calculatedLevel.levelMinutes)
                .setStatus((targetUser.presence?.status || 'none') as any)
                .setBackground('public/images/level-card-background.png')

            let image = await levelCard.build()
            await interaction.editReply({ files: [new AttachmentBuilder(image)] })
        } catch (error) {
            try {
                await interaction.editReply(messageError(error, __filename))
            }
            catch (error) {
                // console.error(consoleError(error, __filename))
            }
        }
    }
}