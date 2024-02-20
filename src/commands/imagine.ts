import { 
    SlashCommandBuilder,
    Client,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    // ButtonBuilder,
    // ButtonStyle,
    // ActionRowBuilder,
} from 'discord.js'
import { consoleError, embedError } from '../libs/error-handler'
import path = require('path')
import models from '../mocks/models'
import Replicate from 'replicate'
import 'dotenv/config'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Genera una imagen usando un prompt.')
        .addStringOption(option => 
            option.setName('prompt')
                .setDescription('Ingrese su prompt.')
                .setRequired(true)
        )
        .addStringOption(option => {
            models.map(model => option.addChoices({ name: model.name, value: model.value }))
            return option.setName('model')
                .setDescription('Cambiar el modelo de IA afectará mucho el tiempo de respuesta.')
                .setRequired(false)
        })
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()

            const replicate = new Replicate({ auth: process.env.REPLICATE_KEY })

            const prompt = interaction.options.get('prompt')?.value as string
            const model = interaction.options.get('model')?.value as string || models[0].value

            const output = await replicate.run(model as any, { input: { prompt } }) as string[] || []

            // const row = new ActionRowBuilder().addComponents(
            //     new ButtonBuilder()
            //         .setLabel(`Download`)
            //         .setStyle(ButtonStyle.Link)
            //         .setURL(`${output[0]}`)
            //         .setEmoji('1101133529607327764')
            // )

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({
                    name: `/Imagine de ${(interaction.member as GuildMember).nickname || interaction.user.displayName}`,
                    iconURL: interaction.user.displayAvatarURL(({ dynamic: true } as any)),
                })
                .addFields({ name: 'Prompt:', value: prompt })
                .setImage(output[0])

            await interaction.editReply({ embeds: [embed],
                // components: [row],
            })
            
        } catch (error) {
            try {
                await interaction.editReply({ embeds: [embedError(error)] })
            }
            catch (error) {
                console.error(consoleError(error, __filename))
            }
        }
    }
}