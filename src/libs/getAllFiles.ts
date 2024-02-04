import { readdirSync } from 'fs'
import { join } from 'path'

export default (directory: string, foldersOnly = false) => {
    try {
        let fileNames = []
        const files = readdirSync(directory, { withFileTypes: true })

        for (const file of files) {
            const filePath = join(directory, file.name)
            if (foldersOnly && file.isDirectory()) fileNames.push(filePath)
            else if (file.isFile()) fileNames.push(filePath)
        }
        fileNames = fileNames.map(fileName => fileName.replace(/\\/g, '/'))

        return fileNames
    } catch (error) {
        console.error('Error getting all files: ' + error)
    }
}