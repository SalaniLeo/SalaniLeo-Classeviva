import { user } from "$lib/user.svelte";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "../$types";
import { cardURL, headers } from "$lib/constants";

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(!user.isLogged) {
        redirect(303, '/')
    }
    headers['Z-Auth-Token'] = user.getInfo.token
    try {
        const response = await fetch(cardURL.replace('{studentId}', String(user.getInfo.ident).slice(1)), {
            method: "GET",
            // @ts-ignore
            headers: headers
        })
        return await response.json()
    } catch(error) {
        console.error(error)
    }
}
