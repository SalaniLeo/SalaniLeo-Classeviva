import { headers, readBachecaURL } from '$lib/constants.js';
import { user } from '$lib/user.svelte.js';

export async function POST({ request, cookies }) {

    const { eventCode, pubId } = await request.json();

    let url = readBachecaURL.replace('{studentId}', String(user.getInfo.ident).slice(1))
    url = url.replace('{eventCode}', String(eventCode)).replace('{pubId}', pubId)

    try {
        let response = await fetch(url, {
            method: "POST",
            // @ts-ignore
            headers: headers
        })
        return new Response(JSON.stringify({ response: await response.json() }), {
            status: 200,
        });
    } catch(error: any) {
        return new Response(JSON.stringify({ message: 'Failed to get comunication details' }), {
            status: 500,
            statusText: error
        });
    }
}
