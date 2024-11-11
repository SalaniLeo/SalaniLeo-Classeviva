import { serialize } from 'cookie';

export async function GET({ request }) {
    const data = {
        isLogged: 'false',
        tokenAP: '',
        token: '',
        firstName: '',
        lastName: '',
        ident: '',
        release: '',
        expire: '',
        showPwdChangeReminder: ''
    };

    const isLoggedCookie = serialize('isLogged', data.isLogged, {
        path: '/',
        httpOnly: false
    });

    const tokenAPCookie = serialize('tokenAP', data.tokenAP, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const tokenCookie = serialize('token', data.token, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const firstNameCookie = serialize('firstName', data.firstName, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const lastNameCookie = serialize('lastName', data.lastName, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const identCookie = serialize('ident', data.ident, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const releaseCookie = serialize('release', data.release, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const expireCookie = serialize('expire', data.expire, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const showPwdChangeReminderCookie = serialize('showPwdChangeReminder', data.showPwdChangeReminder, {
        path: '/',
        expires: new Date(0),
        httpOnly: false
    });

    const headers = new Headers();
    headers.append('Set-Cookie', isLoggedCookie);
    headers.append('Set-Cookie', tokenAPCookie);
    headers.append('Set-Cookie', tokenCookie);
    headers.append('Set-Cookie', firstNameCookie);
    headers.append('Set-Cookie', lastNameCookie);
    headers.append('Set-Cookie', identCookie);
    headers.append('Set-Cookie', releaseCookie);
    headers.append('Set-Cookie', expireCookie);
    headers.append('Set-Cookie', showPwdChangeReminderCookie);
    headers.append('Content-Type', 'application/json');

    return new Response(JSON.stringify({ message: 'Cookies cleared successfully' }), {
        status: 200,
        headers: headers
    });
}
