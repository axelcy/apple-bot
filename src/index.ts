import { Client, IntentsBitField, VoiceState } from 'discord.js'
import eventHandler from './handlers/eventHandler.js'
// import connect from './libs/database/database.js'
import 'dotenv/config'

process.env.NODE_NO_WARNINGS = '1'
// process.env.DISABLE_COMMANDS = '1'

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
    ]
})

try {
    // connect()
    eventHandler(client)
    client.login(process.env.TOKEN)
}
catch (error) {
    console.error('Error connecting to database:\n' + error)
}
