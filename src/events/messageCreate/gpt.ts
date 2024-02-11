import { Client, Message } from "discord.js"
// import { OpenAI } from "openai"

// const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

export default async (client: Client, message: Message) => {
    // Error: 429 You exceeded your current quota
    // To use this again, please install the openai package: npm i openai
    return
    /*
    if (message.author.bot) return
    const CHANNELS = process.env.OPENAI_CHANNEL_ID?.split(',') || []
    if (!CHANNELS.includes(message.channel.id)) return

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 150,
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
    const responseMessage = response?.choices[0].message.content
    if (responseMessage) message.reply(responseMessage || '')
    */
}