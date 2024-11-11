<script lang="ts">
	import { readAllegato } from "$lib/requests";
	import ComunicationDialog from "./comunicationDialog.svelte";

    let { item, i } = $props()

    let comunicazione = $state(item)
    let showDialog = $state(false)
    let dettagli = $state({})

    async function getDetails() {
        dettagli = await readAllegato(comunicazione)
    }
</script>

<main>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore event_directive_deprecated -->
    <div class="flexcolumn gap-small comunicazione"
    class:toRead={!comunicazione.readStatus}
    style="animation: show 1s {i*50}ms forwards;"
    on:click={() => {
        showDialog = true
        getDetails()
        comunicazione.readStatus = true
    }}
    >
    <p>{comunicazione.cntTitle}</p>
        <div class="flexrow gap-small">
            {#if comunicazione.cntCategory}
                <p class="category secondary">{comunicazione.cntCategory}</p>
            {:else}
                <p class="category secondary">Comunicazione</p>
            {/if}
            <p class="publication secondary">{String(comunicazione.pubDT).slice(8, 10)}/{String(comunicazione.pubDT).slice(5, 7)}</p>
        </div>
    </div>
    <ComunicationDialog comunicazione={comunicazione} bind:details={dettagli} bind:showModal={showDialog}></ComunicationDialog>
</main>

<style>
    p {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }
    .toRead {
        background-color: var(--card-color) !important;
    }
    .comunicazione {
        padding: 0.5rem;
        opacity: 0;
        border-radius: var(--border-radius-medium-heavy);
        cursor: pointer;
        background-color: var(--accent-color-primary);
    }
    .comunicazione:hover {
        background-color: var(--accent-color-secondary);
    }
</style>