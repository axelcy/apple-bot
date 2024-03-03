import { SlashCommandBuilder, Client, CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import { consoleError, messageError } from '../libs/error-handler'
import path = require('path')
import 'dotenv/config'

export default {
    slashCommand: new SlashCommandBuilder()
        .setName(path.basename(__filename, path.extname(__filename)))
        .setDescription('Genera una imagen con la información de la cuenta de Valorant.')
        .addStringOption(option =>
            option.setName('cuenta')
                .setDescription('Cuenta de Valorant (nombre#tag).')
                .setRequired(false)
        )
        .addMentionableOption(option =>
            option.setName('usuario')
                .setDescription('@Usuario')
                .setRequired(false)
        )
    ,
    callback: async (client: Client, interaction: CommandInteraction) => {
        let valorantAccount: string = ''
        try {
            await interaction.deferReply()
            const accountOptions = {
                mention: interaction.options.get('usuario')?.value?.toString() || undefined,
                account: interaction.options.get('cuenta')?.value?.toString() || undefined,
                interaction: interaction.user.id
            }
            if (!accountOptions.mention && !accountOptions.account) {
                const valorantUser = await ValorantUser.findOne({ userId: accountOptions.interaction })
                if (!valorantUser) return await interaction.editReply(`No tenés una cuenta de Valorant registrada, usá el comando **/claimrank** para hacerlo.`)
                if (valorantUser?.valorantName) valorantAccount = valorantUser.valorantName
            }
            else if (accountOptions.mention) {
                const valorantUser = await ValorantUser.findOne({ userId: accountOptions.mention })
                if (!valorantUser) return await interaction.editReply(`Esa persona no tiene una cuenta de Valorant registrada.`)
                if (valorantUser?.valorantName) valorantAccount = valorantUser.valorantName
            }
            else if (accountOptions.account) valorantAccount = accountOptions.account
            else throw new Error('No se encontró la cuenta')

            const buffer = await canvasImage(valorantAccount)
            if (!buffer) throw new Error('No se encontró la cuenta')

            const TRACKER_URL = 'https://tracker.gg/valorant/profile/riot'
            const trackerButton = new ButtonBuilder()
                .setEmoji(valorantAccount === 'CLG Santik2010#TRUJO' ? '🗿' : '🔗')
                .setLabel('Valorant Tracker')
                .setStyle(ButtonStyle.Link)
                .setURL(`${TRACKER_URL}/${valorantAccount.replace(/ /g, '%20').replace(/#/g, '%23')}/overview`)

            const actionRow = new ActionRowBuilder().addComponents(trackerButton)
            await interaction.editReply({ files: [buffer], components: [(actionRow as any)] })
        } catch (error) {
            try {
                await interaction.editReply(`No se encontró la cuenta: *${interaction.options.get('cuenta')?.value?.toString() || ''}*`)
            }
            catch (error) {
                console.error(consoleError(error, __filename))
            }
        }
    }
}

import * as Canvas from '@napi-rs/canvas'
// import * as fs from 'fs'
import { tierColors, unrankedData, tierTranslations } from '../mocks/ranks-colors'
import ValorantUser from '../models/ValorantUser'

// LINKS DE LA API
// https://api.henrikdev.xyz/valorant/v1/account/CLG%20Manzana%20Roja/love
// https://api.henrikdev.xyz/valorant/v1/mmr/latam/CLG%20Manzana%20Roja/love

export async function canvasImage(name: string): Promise<Buffer | undefined> {
    try {

        async function fetchData(endpoint: '/account' | '/mmr/latam') {
            const parsedName = name.replace(/ /g, '%20').replace(/#/g, '/')
            try {
                const response = await fetch(`https://api.henrikdev.xyz/valorant/v1${endpoint}/${parsedName}`, {
                    headers: {
                        Authorization: process.env.HENRIKDEV_KEY || ''
                    }
                })
                if (response?.status === 429) console.error('Error: Valorant API Rate Limit Exceeded.')
                return (await response.json()).data
            } catch (error) {
                console.error('Error fetching valorant data:\n' + error)
            }
        }

        const [account, mmr] = await Promise.all([fetchData('/account'), fetchData('/mmr/latam')])
        if (!account || !mmr) return undefined
        Canvas.GlobalFonts.loadFontsFromDir('public/fonts')
        const divisionX = 230

        const canvas = Canvas.createCanvas(950, 400)
        const ctx = canvas.getContext('2d')

        // #region ------------- FONDO -------------
        // const background = await Canvas.loadImage('background.png')
        // ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        // #endregion

        // #region ------------- RANGO Y ULTIMA PARTIDA -------------
        const rankImage: {
            image: Canvas.Image | null,
            x: number,
            y: number,
            size: number
        } = {
            image: null,
            x: 20,
            y: 20,
            size: 192
        }

        rankImage.image = await Canvas.loadImage(mmr.images.large)
        if (rankImage.image) ctx.drawImage(rankImage.image, rankImage.x, rankImage.y, rankImage.size, rankImage.size)

        ctx.font = `60px Ubuntu`
        let prefix = ''
        if (mmr.mmr_change_to_last_game > 0) {
            ctx.fillStyle = '#23fed7'
            prefix = '+'
        }
        else if (mmr.mmr_change_to_last_game < 0) ctx.fillStyle = '#f0615f'
        else ctx.fillStyle = '#f3f3f3'

        ctx.fillText(
            prefix + mmr.mmr_change_to_last_game.toString(),
            divisionX / 2 - ctx.measureText(prefix + mmr.mmr_change_to_last_game.toString()).width / 2,
            rankImage.y + rankImage.size + 70
        )

        ctx.font = `30px Ubuntu`
        ctx.fillStyle = '#969696'
        ctx.fillText(
            'Last Match',
            divisionX / 2 - ctx.measureText('Last Match').width / 2,
            rankImage.y + rankImage.size + 120
        )
        // #endregion

        // #region ------------- ESCRIBIR NOMBRE -------------
        const nameTextY = 60
        ctx.font = `40px Ubuntu`
        ctx.fillStyle = '#f3f3f3'
        ctx.fillText(mmr.name, divisionX, nameTextY)
        ctx.fillStyle = '#969696'
        ctx.fillText('#' + mmr.tag, divisionX + ctx.measureText(mmr.name).width, nameTextY)
        // #endregion

        // #region ------------- PLAYER CARD -------------

        function drawRoundedImage({ image, x, y, width, height, borderRadius = 20 }:
            { image: Canvas.Image | null, x: number, y: number, width: number, height: number, borderRadius?: number }) {
            if (!image) return
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x + borderRadius, y)
            ctx.lineTo(x + width - borderRadius, y)
            ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius)
            ctx.lineTo(x + width, y + height - borderRadius)
            ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height)
            ctx.lineTo(x + borderRadius, y + height)
            ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius)
            ctx.lineTo(x, y + borderRadius)
            ctx.quadraticCurveTo(x, y, x + borderRadius, y)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(image, x, y, width, height)
            ctx.restore()
        }

        const playerCard: {
            image: Canvas.Image | null,
            x: number,
            y: number,
            width: number,
            height: number,
        } = {
            image: null,
            x: divisionX,
            y: nameTextY + 20,
            width: 452 * 1.5,
            height: 128 * 1.5,
        }

        playerCard.image = await Canvas.loadImage(account.card.wide)
        drawRoundedImage({ ...playerCard, borderRadius: 20 });

        // #endregion

        // #region ------------- RANGO TEXTO -------------

        function textShadow(x: number, y: number, blur: number, color: string) {
            ctx.shadowOffsetX = x
            ctx.shadowOffsetY = y
            ctx.shadowBlur = blur
            ctx.shadowColor = color
        }

        const rankNameText = {
            x: divisionX + 20,
            y: playerCard.y + playerCard.height - 20,
        }

        ctx.font = `60px Ubuntu`
        ctx.fillStyle = '#f3f3f3'
        if (tierColors[mmr.currenttierpatched]) ctx.fillStyle = tierColors[mmr.currenttierpatched]
        else ctx.fillStyle = unrankedData.color
        textShadow(2, 2, 10, 'black')
        ctx.fillText(tierTranslations[mmr.currenttierpatched].toUpperCase(), rankNameText.x, rankNameText.y)
        textShadow(0, 0, 0, 'transparent')

        // #endregion

        // #region ------------- BARRA RANK RATING -------------

        function roundRect({ x, y, width, height, radius, fill = true }:
            { x: number, y: number, width: number, height: number, radius: number, fill?: boolean }) {
            if (typeof radius === 'undefined') radius = 5

            ctx.beginPath()
            ctx.moveTo(x + radius, y)
            ctx.lineTo(x + width - radius, y)
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
            ctx.lineTo(x + width, y + height - radius)
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
            ctx.lineTo(x + radius, y + height)
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
            ctx.lineTo(x, y + radius)
            ctx.quadraticCurveTo(x, y, x + radius, y)
            ctx.closePath()

            if (fill) ctx.fill()
            else ctx.stroke()
        }

        const barMargin = 5
        const bar = {
            x: divisionX + barMargin,
            y: playerCard.y + playerCard.height + 20,
            width: playerCard.width - barMargin * 2,
            height: 20,
            radius: 10,
        }

        ctx.fillStyle = '#fff9'
        roundRect(bar)
        ctx.fillStyle = '#23fed7'
        var completedBarProgress
        if (mmr.ranking_in_tier > 1) completedBarProgress = mmr.ranking_in_tier / 100
        else if (mmr.ranking_in_tier === 1) completedBarProgress = 2

        if (completedBarProgress) roundRect({ ...bar, width: bar.width * (mmr.ranking_in_tier / 100) })

        const rankRatingTextMarginY = 40
        const rankRatingTextMarginX = 10
        ctx.font = `25px Ubuntu`
        ctx.fillText(
            mmr.ranking_in_tier.toString(),
            divisionX + bar.width - ctx.measureText((mmr.ranking_in_tier + '/ 100').toString()).width - rankRatingTextMarginX,
            bar.y + bar.height + rankRatingTextMarginY
        )
        ctx.fillStyle = '#f3f3f3'
        ctx.fillText('RANK RATING', divisionX + rankRatingTextMarginX, bar.y + bar.height + rankRatingTextMarginY)
        ctx.fillText(
            ' / 100',
            divisionX + bar.width - ctx.measureText('/ 100'.toString()).width - rankRatingTextMarginX,
            bar.y + bar.height + rankRatingTextMarginY
        )
        // #endregion

        // #region ------------- GUARDAR IMAGEN -------------
        const buffer: Buffer = canvas.toBuffer('image/png')
        // fs.writeFileSync('out.png', buffer)
        return buffer

        // #endregion

    }
    catch (error) {
        console.error('Error creating canvas rank image:\n' + error)
    }
}