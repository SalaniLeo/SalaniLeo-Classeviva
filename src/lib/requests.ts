export async function downloadAllegato(eventCode: number, pubId: number) {
    let response = await fetch('/api/comunicazioni/scarica', {
        method: 'POST',
        // @ts-nocheck
        body: JSON.stringify({ eventCode, pubId }),
    })
    return(await response.json())
}

export async function readAllegato(item: {'evtCode': number, 'pubId': number}) {
    let response = await fetch('/api/comunicazioni/leggi', {
        method: 'POST',
        // @ts-nocheck
        body: JSON.stringify({eventCode: item.evtCode, pubId: item.pubId})
    })
    return(await response.json())
}