import { Client, ActivityType } from 'discord.js'
import commandHandler from '../../handlers/commandHandler'

export default async (client: Client) => {
    if (!client.isReady()) return
    const activity = process.env.NODE_ENV === 'development' ? `In development` : `Zarouu's stream`
    client.user.setActivity({
        name: activity,
        type: ActivityType.Watching,
    })
    commandHandler(client)
}