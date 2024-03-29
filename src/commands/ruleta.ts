import { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Ruleta entre nombres.')
        .addStringOption(option => 
            option.setName('nombres')
                .setDescription('Nombres separados por espacios.')
                .setRequired(true)
        )
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        try {
            await interaction.deferReply()
            const valorantMaps = ['Breeze', 'Haven', 'Bind', 'Split', 'Icebox', 'Ascent', 'Fracture', 'Sunset', 'Pearl', 'Lotus']
            if (interaction.commandName === 'ruleta') {
                const names: string[] | undefined = interaction.options.get('nombres')?.value?.toString().split(' ').filter(name => name !== ' ' && name !== '')
                if (!names || names.length < 2) return await interaction.editReply('Necesitas al menos dos nombres.')
                const sortedNames: string[] = names.sort(() => Math.random() - 0.5)
                const teams: { one: string[], two: string[] } = { one: [], two: [] }
                for (let i = 0; i < sortedNames.length; i++) {
                    if (i % 2 === 0) teams.one.push(sortedNames[i])
                    else teams.two.push(sortedNames[i])
                }
                
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`Mapa: ${valorantMaps[Math.floor(Math.random() * valorantMaps.length)] || 'Mapa no encontrado'}`)
                    .setAuthor({
                        name: `/Ruleta de ${(interaction.member as GuildMember).nickname || interaction.user.displayName}`,
                        iconURL: interaction.user.displayAvatarURL(({ dynamic: true } as any)),
                    })
                    .setThumbnail('https://cdn-icons-png.flaticon.com/512/10199/10199802.png')
                    .addFields(
                        { name: 'Atacantes', value: teams.one.join(', '), inline: true },
                        { name: 'Defensores', value: teams.two.join(', '), inline: true },
                        { name: '\u200B', value: '\u200B' },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: 'Ruleta de mapas de Valorant. (/ruleta)',
                        iconURL: client.user?.displayAvatarURL(({ dynamic: true } as any)),
                    })
                await interaction.editReply({ embeds: [embed] })
            }
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