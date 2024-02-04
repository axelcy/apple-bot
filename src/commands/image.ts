import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'
import path = require('path')
import { Canvas } from '@napi-rs/canvas'
import { createCanvas } from '@napi-rs/canvas'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, '.ts'))
        .setDescription('genera una imagen test.')
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        try {
            // mandar foto
            const canvas = createCanvas(200, 200)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = 'red'
            ctx.fillRect(20, 20, 150, 100)
            const buffer = canvas.toBuffer('image/png')
            await interaction.reply({ files: [buffer], ephemeral: true })
        } catch (error) {
            console.error(`Error en "${path.basename(__filename, '.ts')}.ts": ` + error);
        }
    }
}