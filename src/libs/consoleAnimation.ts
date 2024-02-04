export default async(stop = [true], ms = 250, frames = ['-', '\\', '|', '/']) => {
    while (stop[0]) {
        for (const frame of frames) {
            process.stdout.write('\r' + frame)
            await new Promise(resolve => setTimeout(resolve, ms))
        }
    }
}