let userState = $state({
        "firstName": undefined,
        "lastName": undefined,
        "ident": undefined,
        "token": undefined,
        "tokenAP": undefined,
});

let userLogged = $state(false)
let userCard = $state({})
let userGrades = $state([])
let userAgenda = $state({})
let userNoticeboard = $state([])
let userAbsences = $state([])

export function getUser() {

    function reset() {
        userCard = {}
        userAbsences = []
        userAgenda = {}
        userGrades = []
        userNoticeboard = []
        userState = {
            "firstName": undefined,
            "lastName": undefined,
            "ident": undefined,
            "token": undefined,
            "tokenAP": undefined,
    }
    }

    function logout() {
        userLogged = false
        reset()
    }

    function setGrades(grades: []) {
        userGrades = grades
    }
	
    function setAgenda(agenda: {}) {
        userAgenda = agenda
    }

    function setLogged(logged: boolean) {
        userLogged = logged
    }

    function setCard(card: object) {
        userCard = card
    }

	function setInfo(info: object) {
		//@ts-ignore
        userState = info;
	}

    function setNoticeboard(board: []) {
        userNoticeboard = board
    }

    function setAbsences(days: []) {
        userAbsences = days
    }

	return {
		get getInfo() {
			return userState;
		},
        get isLogged() {
            return userLogged;
        },
        get getCard() {
            return userCard;
        },
        get getGrades() {
            return userGrades;
        },
        get getAgenda() {
            return userAgenda;
        },
        get getNoticeboard() {
            return userNoticeboard;
        },
        get getAbsences() {
            return userAbsences;
        },
        setAbsences,
        setNoticeboard,
        setAgenda,
        setCard,
        logout,
        setGrades,
        setLogged,
		setInfo,
        reset
	};
}

export let user = getUser()