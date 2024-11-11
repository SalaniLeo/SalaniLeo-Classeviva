import { headers, loginUrl } from '$lib/constants.js';
import { fail, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types.js';
import { user } from '$lib/user.svelte.js';

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(cookies.get('isLogged') == "true") {
        redirect(303, '/')
    }
}

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if(!username || !password) {
            return fail(403, {
                error: "Please fill up each field",
                state: "var(--font-primary-color)"
            });
        }

        const response = await fetch(loginUrl, {
            method: "POST",
            // @ts-ignore
            headers: headers,
            body: JSON.stringify({"ident":null,"pass":password,"uid":username})
        })

        if(response.ok) {
            await response.json().then((data) => {
                cookies.set('isLogged', "true", { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('tokenAP', data.tokenAP, { path: '/', maxAge: 15 * 60, httpOnly: false });
                cookies.set('token', data.token, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('firstName', data.firstName, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('lastName', data.lastName, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('ident', data.ident, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('release', data.release, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('expire', data.expire, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                cookies.set('showPwdChangeReminder', data.showPwdChangeReminder, { path: '/', maxAge: 24 * 60 * 60 * 7, httpOnly: false });
                redirect(303, '/user')
            })
        } else {
            let error = await response.json()
                if(error.info == "WrongCredentials") {
                    return fail(422, {
                        error: "Username o password non validi",
                        state: "var(--font-error-color)"
                    });
            } else if(error.info == 'WrongCredentials:u') {
                return fail(422, {
                    error: "Troppi tentativi di login, richiesta bloccata",
                    state: "var(--font-error-color)"
                });
            }
        }
    }
};