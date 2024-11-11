import { type Handle } from "@sveltejs/kit";


export const handle: Handle = async ({ event, resolve }) => {

    let cookieTheme = event.cookies.get("theme");
    //@ts-ignore
    // currentTheme.set(cookieTheme)

    if (!cookieTheme) {
        cookieTheme = "dark";
        event.cookies.set("theme", cookieTheme, { path: '/', sameSite: true, maxAge: 2592000, secure: false, httpOnly: false });
    }

    const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
            return html.replace('data-theme=""', `data-theme="${cookieTheme}"`);
        }
    });

    return response;
};