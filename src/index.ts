import { Client, IntentsBitField, ActivityType } from 'discord.js'
import 'dotenv/config'
import commandHandler from './commandHandler.js'

process.env.NODE_NO_WARNINGS = '1' 

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})


client.on('ready', client => {
    console.clear()
    console.log(`✅ ${client.user.tag} is online.`)
    const activity = process.env.NODE_ENV === 'development' ? `In development` : `Zarouu's stream`
    client.user.setActivity({
        name: activity,
        type: ActivityType.Watching,
    })
    commandHandler(client)
    // console.log(client.guilds.cache.map(guild => `🔍 ${guild.name} (${guild.id})`))
})

client.login(process.env.TOKEN)