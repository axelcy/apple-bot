import { Client, IntentsBitField, EmbedBuilder, ActivityType } from 'discord.js'
import 'dotenv/config'

const valorantMaps = ['Breeze', 'Haven', 'Bind', 'Split', 'Icebox', 'Ascent', 'Fracture', 'Sunset', 'Pearl', 'Lotus']

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

client.on('messageCreate', message => {
    if (message.author.bot) return
    console.log(message.content)
})

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return
        await interaction.deferReply()
        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        if (interaction.commandName === 'ruleta') {
            const names = interaction.options.getString('nombres').split(',')
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
                // { name: `Mapa`, value: valorantMaps[Math.floor(Math.random() * valorantMaps.length)] },
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
        console.log('Error: ' + error)
    }
})

const statusList = [`Zarouu's stream`, '']

client.on('ready', client => {
    console.clear()
    console.log(`✅ ${client.user.tag} is online.`)
    client.user.setActivity({
        name: `Zarouu's stream`,
        type: ActivityType.Watching,
    })
})

client.login(process.env.TOKEN)