export const loginUrl = "https://web.spaggiari.eu/rest/v1/auth/login";
export const cardURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/card"
export const gradesURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/grades"
export const bachecaURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/noticeboard"
export const readBachecaURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/noticeboard/read/{eventCode}/{pubId}/101"
export const getFileUrl = "https://web.spaggiari.eu/rest/v1/students/{studentId}/noticeboard/attach/{eventCode}/{pubId}/101"
export const agendaURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/agenda/all/{begin}/{end}"
export const absencesURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/absences/details"
export const notesURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/notes/all" 
export const didatticaURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/didactics"
export const getDidatticaItem = "https://web.spaggiari.eu/rest/v1/students/{studentId}/didactics/item/{contentId}"
export const getLessonsURL = "https://web.spaggiari.eu/rest/v1/students/{studentId}/lessons/{start}/{end}"
export const checkToken = "https://web.spaggiari.eu/rest/v1/auth/ticket"
export const headers = {
	"content-type": "application/json",
	"Z-Dev-ApiKey": "Tg1NWEwNGIgIC0K",
	"Z-Auth-Token": undefined,
	"User-Agent": "CVVS/std/4.2.3 Android/12"
};