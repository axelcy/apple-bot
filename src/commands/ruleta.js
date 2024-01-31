import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'

export default {
    name: 'ruleta',
    description: 'Ruleta entre nombres.',
    options: [
        {
            name: 'nombres',
            description: 'Nombres separados por comas.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    callback: async (interaction) => {
        console.log('CALLBACK RULETA!!')
        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        try {
            if (!interaction.isChatInputCommand()) return
            await interaction.deferReply()
            const valorantMaps = ['Breeze', 'Haven', 'Bind', 'Split', 'Icebox', 'Ascent', 'Fracture', 'Sunset', 'Pearl', 'Lotus']
            if (interaction.commandName === 'ruleta') {
                console.log(interaction.options.getString('nombres'))
                const names = interaction.options.getString('nombres').split(',').filter(name => name !== ' ' && name !== '')
                if (names.length < 2) return await interaction.editReply('Necesitas al menos dos nombres.')
                const sortedNames = names.sort(() => Math.random() - 0.5)
                const teams = { one: [], two: [] }
                for (let i = 0; i < sortedNames.length; i++) {
                    if (i % 2 === 0) teams.one.push(sortedNames[i])
                    else teams.two.push(sortedNames[i])
                }
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`Mapa: ${valorantMaps[Math.floor(Math.random() * valorantMaps.length)] || 'Mapa no encontrado'}`)
                    .setAuthor({
                        name: `Ruleta de ${interaction.member.nickname || interaction.member.user.globalName}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
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
                        iconURL: 'https://cdn.discordapp.com/avatars/1052362161051144243/357ba487db9ba7e60449f0d962db388c.png',
                    })
                await interaction.editReply({ embeds: [embed] })
            }
        } catch (error) {
            console.error('Error en "ruleta.js": ' + error)
        }
    }
}