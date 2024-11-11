import { user } from '$lib/user.svelte';
import { redirect } from '@sveltejs/kit';
import { gradesURL, headers } from '$lib/constants';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(!user.isLogged) {
        redirect(303, '/')
    }

    if(Object.keys(user.getGrades).length > 0) {
        return user.getGrades
    } else {
        headers['Z-Auth-Token'] = user.getInfo.token
        try {
            const response = await fetch(gradesURL.replace('{studentId}', String(user.getInfo.ident).slice(1)), {
                method: "GET",
                // @ts-ignore
                headers: headers
            })
            let gradesJSON = await response.json()
            user.setGrades(gradesJSON)
            return gradesJSON
        } catch(error) {
            console.error(error)
        }
    }
}