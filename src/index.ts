import { Client, IntentsBitField } from 'discord.js'
import eventHandler from './handlers/eventHandler.js'
import 'dotenv/config'

process.env.NODE_NO_WARNINGS = '1'

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

eventHandler(client)

client.login(process.env.TOKEN)