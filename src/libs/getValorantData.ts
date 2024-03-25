import 'dotenv/config'

// LINKS DE LA API
// https://api.henrikdev.xyz/valorant/v1/account/CLG%20Manzana%20Roja/love
// https://api.henrikdev.xyz/valorant/v1/mmr/latam/CLG%20Manzana%20Roja/love

export default async function getValorantData(endpoint: '/account' | '/mmr/latam', name: string) {
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