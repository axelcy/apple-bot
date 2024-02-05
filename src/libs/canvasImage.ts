import * as Canvas from '@napi-rs/canvas'
// import * as fs from 'fs'
import { tierColors, unrankedData, tierTranslations } from '../mocks/ranks-colors'

// LINKS DE LA API
// https://api.henrikdev.xyz/valorant/v1/account/CLG%20Manzana%20Roja/love
// https://api.henrikdev.xyz/valorant/v1/mmr/latam/CLG%20Manzana%20Roja/love

export default async function canvasImage(name: string): Promise<Buffer | undefined> {
try {

async function fetchData(endpoint: '/account' | '/mmr/latam') {
    const parsedName = name.replace(/ /g, '%20').replace(/#/g, '/')
    try {
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v1${endpoint}/${parsedName}`, {
            headers: {
                Authorization: 'HDEV-73be5985-8e36-43d0-be8c-ad71124e7bee'
            }
        })
        if (response?.status === 429) console.error('EXPLOTACIÓN DE LA API MUCHAS LLAMADAS :V')
        return (await response.json()).data
    } catch (error) {
        console.error(error)
    }
}

const [account, mmr] = await Promise.all([fetchData('/account'), fetchData('/mmr/latam')])
if (!account || !mmr) return undefined
Canvas.GlobalFonts.loadFontsFromDir('testing/fonts')
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
    { image: Canvas.Image | null, x: number, y: number, width: number, height: number, borderRadius?: number}) {
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
roundRect({ ...bar, width: bar.width * (mmr.ranking_in_tier / 100) })

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
return buffer
// fs.writeFileSync('testing/out.png', buffer)

// #endregion

}
catch (error) {
    console.error(error)
}
}