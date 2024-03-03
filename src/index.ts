import { Client, IntentsBitField } from 'discord.js'
import 'dotenv/config'
import start from './libs/start.js'

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
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions
    ]
})

start(client)
