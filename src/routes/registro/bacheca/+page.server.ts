import { user } from '$lib/user.svelte';
import { redirect } from '@sveltejs/kit';
import {  bachecaURL, headers } from '$lib/constants';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(!user.isLogged) {
        redirect(303, '/')
    }

    headers['Z-Auth-Token'] = user.getInfo.token
    let baseString = bachecaURL.replace('{studentId}', String(user.getInfo.ident).slice(1))

    try {
        const response = await fetch(baseString, {
            method: "GET",
            // @ts-ignore
            headers: headers
        })
        let bachecaJSON = await response.json()
        user.setNoticeboard(bachecaJSON.items)
        return {
            "noticeBoard": bachecaJSON.items,
        }
    } catch(error) {
        console.error(error)
    }
}