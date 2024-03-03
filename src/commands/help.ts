import { 
    SlashCommandBuilder,
    Client,
    CommandInteraction,
    EmbedBuilder,
    GuildMember
} from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('el apel bot te saluda.')
    ,
    callback: async(client: Client, interaction: CommandInteraction) => {
        try {
            await interaction.deferReply()
            // el apel bot es...
            // lista de comandos
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({
                    name: `/Help de ${(interaction.member as GuildMember).nickname || interaction.user.displayName}`,
                    iconURL: interaction.user.displayAvatarURL(({ dynamic: true } as any)),
                })

            await interaction.editReply({ embeds: [embed] })
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