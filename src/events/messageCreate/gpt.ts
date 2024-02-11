import { Client, Message } from "discord.js"
import { OpenAI } from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async (client: Client, message: Message) => {
    if (message.author.bot) return
    const CHANNELS = process.env.OPENAI_CHANNEL_ID?.split(',') || []
    if (!CHANNELS.includes(message.channel.id)) return

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: message.content
            }
        ]
    }).catch(error => console.error('OPENAI Error:\n' + error))
}