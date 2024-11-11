<script>
	import { user } from "$lib/user.svelte";

    export let data;
    let accountInfo = user.getInfo
    // @ts-ignore
    let userInfo = data.card
</script>

<div class="page">
    <div class="padding3">
        <div class="flexcolumn">
            <div class="flexcolumn"
            style="animation: show 1s 0ms forwards; opacity: 0;"
            >
                <h2>Info account</h2>
                <p>Nome: {accountInfo.firstName}</p>
                <p>Cognome: {accountInfo.lastName}</p>
                <p>ID: {accountInfo.ident}</p>
            </div>
            <div class="flexcolumn"
            style="animation: show 1s 100ms forwards; opacity: 0;"
            >
                <h2>Info studente</h2>
                <p>Nome: {userInfo.firstName}</p>
                <p>Cognome: {userInfo.lastName}</p>
                <p>Data di nascita: {userInfo.birthDate}</p>
                <p>Codice fiscale: {userInfo.fiscalCode}</p>
                <p>Nome scuola: {userInfo.schDedication}</p>
                <p>Codice scuola: {userInfo.schCode}</p>
                <p>Città: {userInfo.schCity}, {userInfo.schProv}</p>
            </div>
            <div class="flexcolumn"
            style="animation: show 1s 200ms forwards; opacity: 0;"
            >
                <h2>Keys</h2>
                <p class="key">Api Key: {accountInfo.token}</p>
                <p class="key">Api keyAP (?): {accountInfo.tokenAP}</p>
            </div>
        </div>
    </div>
</div>

<style>
    * {
        text-wrap: wrap;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
    p {
        margin: 0.5rem;
    }
</style>