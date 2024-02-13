import { SlashCommandBuilder, Client, CommandInteraction, GuildMember, AttachmentBuilder } from 'discord.js'
import path = require('path')
import User from '../models/User'
import { LeaderboardBuilder, Font } from 'canvacord'
import calculateLevel from '../libs/calculateLevel'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Muestra el top de usuarios con más tiempo en voz.')
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            if (!interaction.guild?.id) return interaction.reply('Este comando solo puede ser usado en un servidor.')
            await interaction.deferReply()
            // obtener usuarios con más minutos
            const topUsersAmount = 6
            const dbTopUsers = await User.find({ guildId: interaction.guild.id }).select('-_id userId level minutes').sort({ minutes: -1 }).limit(topUsersAmount)
            const discordTopUsers = await Promise.all(dbTopUsers.map(async user => await interaction.guild?.members.fetch(user.userId)))
            const topUsers = []
            for (let i = 0; i < dbTopUsers.length; i++) {
                topUsers.push({
                    avatar: discordTopUsers[i]?.user.displayAvatarURL({ size: 256 }).replace('gif', 'png') || 'https://cdn.discordapp.com/embed/avatars/0.png',
                    displayName: discordTopUsers[i]?.displayName || 'Unknown',
                    username: discordTopUsers[i]?.user.tag || '@unknown#0000',
                    level: dbTopUsers[i].level,
                    xp: dbTopUsers[i].minutes,
                    rank: i + 1
                })
            }
            Font.loadDefault()
            const leaderboardCard = new LeaderboardBuilder()
                .setHeader({
                    title: `Top ${topUsersAmount} ${interaction.guild.name} Users`,
                    image: interaction.guild?.iconURL({ size: 256 })?.replace('gif', 'png') || 'https://cdn.discordapp.com/embed/avatars/0.png',
                    subtitle: '1 xp = 1 minuto en voz'
                })
                .setPlayers(topUsers)
                .setBackground('public/images/leaderboard-background.png')

                let image = await leaderboardCard.build()
            await interaction.editReply({ files: [new AttachmentBuilder(image)] })
        } catch (error) {
            try {
                await interaction.editReply(`Hubo un error con el comando /${path.basename(__filename, path.extname(__filename))}.`)
            }
            catch (error) {
                console.error(`Error en "${path.basename(__filename, path.extname(__filename))}${path.extname(__filename)}":\n` + error)
            }
        }
    }
}