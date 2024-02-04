import * as Canvas from '@napi-rs/canvas'
import * as fs from 'fs'
import { tierColors, unrankedData, tierTranslations } from './mocks/ranks-colors'

console.clear()
// https://api.henrikdev.xyz/valorant/v1/account/CLG%20Manzana%20Roja/love

async function makeCanvas() {
try {

async function fetchData(name: string) {
    const parsedName = name.replace(/ /g, '%20').replace(/#/g, '/')
    try {
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/latam/${parsedName}`, {
            headers: {
                Authorization: 'HDEV-73be5985-8e36-43d0-be8c-ad71124e7bee'
            }
        })
        if (response?.status === 429) throw new Error('EXPLOTACIÓN DE LA API MUCHAS LLAMADAS :V')
        return (await response.json()).data
    } catch (error) {
        console.error(error)
    }
}

// valoProfile.images.large
const cardImageUrl = 'https://media.valorant-api.com/playercards/fd4d518f-4760-33b8-7265-9794ceadba16/wideart.png'

const data = {
    currenttier: 19,
    currenttierpatched: "Diamond 2",
    images: {
        small: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/smallicon.png",
        large: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png",
        triangle_down: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/ranktriangledownicon.png",
        triangle_up: "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/ranktriangleupicon.png"
    },
    ranking_in_tier: 43,
    mmr_change_to_last_game: -11,
    elo: 1643,
    name: "CLG Manzana Roja",
    tag: "love",
    old: false
}

Canvas.GlobalFonts.loadFontsFromDir('testing/fonts')
const divisionX = 230

const canvas = Canvas.createCanvas(1000, 450)
const ctx = canvas.getContext('2d')

// const valoProfile = await fetchData('CLG Manzana Roja#love')

// #region ------------- FONDO -------------
const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fw800/background/20231105/pngtree-blank-dark-wallpaper-elegant-black-texture-background-image_13747095.png')
ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

// #endregion

// #region ------------- IMAGEN RANGO -------------
const rankImage = await Canvas.loadImage(data.images.large) // valoProfile.images.large
ctx.drawImage(rankImage, 20, 20, 192, 192)

// #endregion

// #region ------------- ESCRIBIR NOMBRE -------------
const nameTextY = 60
ctx.font = `40px Ubuntu`
ctx.fillStyle = '#f3f3f3'
ctx.fillText('CLG Manzana Roja', divisionX, nameTextY) // valoProfile.name
ctx.fillStyle = '#969696'
ctx.fillText('#love', divisionX + ctx.measureText('CLG Manzana Roja').width, nameTextY) // valoProfile.tag

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

playerCard.image = await Canvas.loadImage(cardImageUrl)

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
// if (tierColors[data.currenttierpatched]) ctx.fillStyle = tierColors[data.currenttierpatched]
// else ctx.fillStyle = unrankedData.color
textShadow(2, 2, 10, 'black')
ctx.fillText(data.currenttierpatched.toUpperCase(), rankNameText.x, rankNameText.y) // valoProfile.name
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
roundRect({ ...bar, width: bar.width * (data.ranking_in_tier / 100) })

const rankRatingTextMarginY = 40
const rankRatingTextMarginX = 10
ctx.font = `25px Ubuntu`
ctx.fillText(
    data.ranking_in_tier.toString(), 
    divisionX + bar.width - ctx.measureText((data.ranking_in_tier + '/ 100').toString()).width - rankRatingTextMarginX, 
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
const buffer = canvas.toBuffer('image/png')
fs.writeFileSync('testing/out.png', buffer)

// #endregion

}
catch (error) {
    console.error(error)
}
}

makeCanvas()