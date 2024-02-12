// Minutos para subir de nivel:
// lvl0 = 0
// lvl1 = lvl0 + 15 * 1 = 15
// lvl2 = lvl1 + 15 * 2 = 45
// lvl3 = lvl2 + 15 * 3 = 90
// lvl4 = lvl3 + 15 * 4 = 150
// lvl5 = lvl4 + 15 * 5 = 225

export default (minutes: number, minutesXlevel: number): number => {
    // Verificar que los minutos sean iguales o mayores a 0
    if (minutes < 0) throw new Error("Los minutos deben ser igual o mayores a 0.")
    let level = 0
    let totalTime = 0
    while (totalTime <= minutes) {
        level++
        totalTime += level * minutesXlevel
    }
    return level - 1
}