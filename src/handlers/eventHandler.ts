import { Client } from "discord.js"
import getAllFiles from "../libs/getAllFiles.js"

export default async (client: Client) => {
    try {
        if (!process.env.INDEX_FILE_FOLDER) return console.error('INDEX_FILE_FOLDER environment variable not set.')
        const eventFolders = getAllFiles(`${process.env.INDEX_FILE_FOLDER}/events`, true)
        if (!eventFolders) return console.error('No events folders found.')

        for (const eventFolder of eventFolders) {
            const eventFiles = getAllFiles(eventFolder)
            if (!eventFiles) continue
            client.on(eventFolder.split(`${process.env.INDEX_FILE_FOLDER}/events/`)[1], async(arg) => {
                for (const eventFile of eventFiles) {
                    const eventFunction = (await import(`../${eventFile.split(`${process.env.INDEX_FILE_FOLDER}/`)[1]}`)).default
                    await eventFunction(client, arg)
                }
            })
        }
    } catch (error) {
        console.error('Event handler error: ' + error)
    }
}