import { cardURL, checkToken, headers, loginUrl } from "$lib/constants";
import { user } from "$lib/user.svelte";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = async ({ url, cookies, getClientAddress, request }: Parameters<LayoutServerLoad>[0]) => {
    let token = cookies.get('token')
    let tokenAP = cookies.get('tokenAP')
    let release = cookies.get('release')
    let expire = cookies.get('expire')
    let ident = cookies.get('ident')

    let isLogged = false
    try {
        if(token != undefined) {
            // @ts-ignore
            headers['Z-Auth-Token'] = token
            const response = await fetch(cardURL.replace('{studentId}', String(ident).slice(1)), {
                method: "GET",
                // @ts-ignore
                headers: headers
            })

            if(response.ok) {
                const responseJSON = await response.json()
                isLogged = true

                let firstName = responseJSON.card.firstName;
                let lastName = responseJSON.card.lastName;
                let showPwdChangeReminder = responseJSON.card.showPwdChangeReminder;

                return {
                    userInfo: {
                        firstName,
                        lastName,
                        ident,
                        token,
                        tokenAP,
                        isLogged,
                        release,
                        expire
                    }
                }
            } else if (response.status === 401) {
                cookies.set('isLogged', "false", { path: '/', httpOnly: false })
            }
        } else {
            return {
                userInfo: {
                    isLogged,
                }
            }
        }
    } catch(error) {
        return {
            userInfo: {
                isLogged,
            }
        }
    }
}