import { Client, VoiceState } from 'discord.js'
import giveUserXp from '../../libs/database/giveUserXp'
import 'dotenv/config'

const xpAvailableMembers: Set<string> = new Set()
var interval: NodeJS.Timeout | null = null
export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {
    if (!client.isReady()) return
    if (oldState.channelId) { // PARA EL CANAL VIEJO
        const oldChannelMembers: string[] = oldState.channel?.members.map(member => member.id) || []
        if (oldChannelMembers.length === 1) xpAvailableMembers.delete(oldChannelMembers[0])
    }
    if (newState.channelId) { // PARA EL CANAL NUEVO
        const newChannelMembers: string[] = newState.channel?.members.map(member => member.id) || []
        if (newChannelMembers.length === 1) xpAvailableMembers.delete(newChannelMembers[0])
        if (newChannelMembers.length > 1) newChannelMembers.forEach(member => xpAvailableMembers.add(member))
    }
    else { // PARA EL CASO DE QUE SE DESCONECTE
        xpAvailableMembers.delete(oldState.member?.id as string)
    }
    // Si no hay usuarios en el Set, se limpia el intervalo (si existe)
    if (interval && xpAvailableMembers.size === 0) {
        clearInterval(interval as NodeJS.Timeout)
        interval = null
    }
    // Si no hay intervalo y hay usuarios en el Set, se crea un intervalo
    if (!interval && xpAvailableMembers.size > 0) {
        interval = setInterval(async () => {
            xpAvailableMembers.forEach((memberId) => giveUserXp(client, memberId, newState.guild.id))
        }, 1000 * 60)
    }
}
