import { EmbedBuilder } from "discord.js"

export const embedError = (error: any): EmbedBuilder => (
    new EmbedBuilder().setTitle('An error occurred')
    .setDescription('```' + error + '```')
    .setColor(0xe32424)
)

export const messageError = (error: any, __filename: string = ''): string => (
    `Hubo un error con el comando /${__filename.split('\\').pop()?.split('.')[0]}.`
)

export const consoleError = (error: any, __filename: string = ''): string => (
    `Error en "${__filename.split('\\').pop()}":\n` + error
)