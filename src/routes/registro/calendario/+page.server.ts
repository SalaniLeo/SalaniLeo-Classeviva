import { user } from '$lib/user.svelte';
import { redirect } from '@sveltejs/kit';
import { absencesURL, agendaURL, getLessonsURL, gradesURL, headers } from '$lib/constants';
import type { LayoutServerLoad } from '../../$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    if(!user.isLogged) {
        redirect(303, '/')
    }

    let start = 20240901
    let end = 20250831

    let Agenda;
    let Assenze;
    let Lezioni;

    headers['Z-Auth-Token'] = user.getInfo.token
    let baseAgendaString = agendaURL.replace('{studentId}', String(user.getInfo.ident).slice(1))
    let idString = baseAgendaString.replace('{begin}', String(start))
    let finishedString = idString.replace('{end}', String(end))

    try {
        const response = await fetch(finishedString, {
            method: "GET",
            // @ts-ignore
            headers: headers
        })
        let agendaJSON = await response.json()
        user.setAgenda(agendaJSON.agenda)
        Agenda = agendaJSON.agenda
    } catch(error) {
        console.error(error)
    }

    let baseLessonsURL = getLessonsURL.replace('{studentId}', String(user.getInfo.ident).slice(1)).replace('{start}', String(start)).replace('{end}', String(end))
    try {
        const response = await fetch(baseLessonsURL, {
            method: "GET",
            // @ts-ignore
            headers: headers
        })
        let lessonsJSON = await response.json()
        Lezioni = lessonsJSON.lessons
    } catch(error) {
        console.error(error)
    }

    let baseAbsencesString = absencesURL.replace('{studentId}', String(user.getInfo.ident).slice(1))

    try {
        const response = await fetch(baseAbsencesString, {
            method: "GET",
            // @ts-ignore
            headers: headers
        })
        let absencesJSON = await response.json()
        Assenze = absencesJSON.events
    } catch(error) {
        console.error(error)
    }

    return {
        "Assenze": Assenze,
        "Agenda": Agenda,
        "Lezioni": Lezioni,
        "Start": start,
        "end": end
    }

}