
const procesarLote = async (lote, procesarItem) => {
    const subLotes = []
    const exitosos = []
    const fallidos = []

    for (let i = 0; i < lote.length; i += 5) {
        const loteActual = lote.slice(i, i + 5)
        subLotes.push(loteActual)
    }

    for (const loteProcesar of subLotes) {
        await Promise.all(loteProcesar.map(async (item) => {
            try {
                const resultado = await procesarItem(item)
                exitosos.push({ resultado })
            } catch (err) {
                fallidos.push({ item, error: err })
            }
        }))
    }

    return { exitosos, fallidos };
}