import { Client } from 'discord.js'
import eventHandler from '../handlers/eventHandler'
import mongoose from 'mongoose'
import 'dotenv/config'

export default async(client: Client) => {
    try {
        if (!process.env.MONGODB_URI) return console.error("MONGODB_URI is not defined in .env file.")
        await mongoose.connect(process.env.MONGODB_URI)
        eventHandler(client)
        client.login(process.env.TOKEN)
    }
    catch (error) {
        console.error('Error connecting to database:\n' + error)
    }
}