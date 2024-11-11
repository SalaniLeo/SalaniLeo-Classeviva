<script lang="ts">
	import { downloadAllegato } from "$lib/requests";

      /**
	 * @type {HTMLDialogElement}
	 */
      let target: HTMLDialogElement;

        let { showModal = $bindable(), comunicazione, details = $bindable()} = $props()
        let fileResponse = $state({'response': {'message': ''}})

        $effect(() => {
            if(showModal) {
                target.showModal()
            } else {
                target.close()
            }
        })

        async function getFiles() {
            fileResponse = await downloadAllegato(comunicazione.evtCode, comunicazione.pubId)
        }

        function getDayName(dateStr: string) {
            const dateObj = new Date(dateStr);

            const dayName = dateObj.toLocaleDateString("en-US", { weekday: 'long' });
            const monthName = dateObj.toLocaleDateString("en-US", { month: 'long' });

            return `${dayName} ${dateObj.getDay()} ${monthName} ${dateObj.getFullYear()}`
        }
  </script>
  
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore event_directive_deprecated -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <dialog 
        onclose={() => showModal = false} 
        bind:this={target}>
        <div class="flexcolumn gap-medium">
            <div class="flexcolumn gap-moderate">
                <div>
                    <h2>{comunicazione.cntTitle}</h2>
                </div>
                <div class="flexrow">
                    <div class="flexcolumn">
                        <p class="secondary">ID</p>
                        <p class="secondary">Pubblicata</p>
                        <p class="secondary">Categoria</p>
                        <p class="secondary">Dettagli</p>
                        <p class="secondary">Valida</p>
                        <p class="secondary">Valida dal</p>
                        <p class="secondary">Fino al</p>
                        {#if comunicazione.cntHasAttach}
                            <p class="secondary">Allegato</p>
                            <p class="secondary">Downloads do NOT work</p>
                        {/if}
                    </div>
                    <div class="flexcolumn">
                        <p>{comunicazione.pubId}</p>
                        <p>{getDayName(comunicazione.pubDT)}</p>
                        {#if comunicazione.cntCategory}
                            <p>{comunicazione.cntCategory}</p>
                        {:else}
                            <p>Comunicazione</p>
                        {/if}
                        {#if details.response}
                            <p>{details.response.item.text}</p>
                        {:else}
                            <p>Loading...</p>
                        {/if}
                        {#if comunicazione.cntValidInRange == true}
                            <p>Si</p>
                        {:else}
                            <p>No</p>
                        {/if}
                        <p>{comunicazione.cntValidFrom}</p>
                        <p>{comunicazione.cntValidTo}</p>
                        {#if comunicazione.cntHasAttach}
                            {#each comunicazione.attachments as allegato}
                                <button class="allegato" onclick={() => getFiles()}>
                                    <p>{allegato.fileName}</p>
                                </button>
                            {/each}
                        {/if}
                        <p>{fileResponse.response.message}</p>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <button onclick={() => target.close()}>Ok</button>
            </div>
        </div>
  </dialog>
  
  <style>
    .allegato {
        height: 35.2px;
    }
    .flexrow {
        flex-wrap: nowrap;
    }
    button > p {
        margin: 0;
    }
    button {
        max-width: unset;
        min-width: 3.5rem;
        padding: 0.5rem;
        outline: none;
        background-color: var(--accent-color-secondary);
    }

    button:hover {
        box-shadow: var(--shadow-color-medium) 0px 0px 2px 0px;
        background-color: var(--primary-color);
    }

    .bottom{
        padding-right: 0.5rem;
        padding-left: 0.5rem;
    }

    h2, p {
        margin: 0.5rem;
    }

    @media screen and (max-width: 720px) {
        dialog {
            margin: 0px !important;
            max-width: unset !important;
            box-shadow: none;
            height: 100vh !important;
            border-radius: unset;
        }
	}
</style>