import { user } from '$lib/user.svelte';
import { redirect } from '@sveltejs/kit';
import { didatticaURL, headers, notesURL } from '$lib/constants';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(!user.isLogged) {
        redirect(303, '/')
    }

    // if(Object.keys(user.getnotes).length > 0) {
        // return user.getnotes
    // } else {
        headers['Z-Auth-Token'] = user.getInfo.token
        try {
            const response = await fetch(didatticaURL.replace('{studentId}', String(user.getInfo.ident).slice(1)), {
                method: "GET",
                // @ts-ignore
                headers: headers
            })
            let didatticaJSON = await response.json()
            return {didattica: didatticaJSON.didactics}
        } catch(error) {
            console.error(error)
        }
    // }
}