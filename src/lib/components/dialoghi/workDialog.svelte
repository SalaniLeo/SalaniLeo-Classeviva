<script>
	import { capitalizeNames } from "$lib";

      /**
	 * @type {HTMLDialogElement}
	 */
      let target;

        let { showModal = $bindable(), compiti } = $props()

        $effect(() => {
            if(showModal) {
                target.showModal()
            } else {
                target.close()
            }
        })
  </script>
  
  <!-- svelte-ignore event_directive_deprecated -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <dialog 
        on:click|self={() => {
            showModal = false;
        }}
        on:close={() => {
            showModal = false
        }} bind:this={target}>
        <div class="flexcolumn gap-medium">
            {#each compiti as compito, i}
            <div class="flexcolumn gap-moderate">
                {#if i < 1}
                    <div>
                        <h2>{capitalizeNames(compito.authorName)}</h2>
                    </div>
                {/if}
                <p>{compito.notes}</p>
            </div>
            {/each}
            <div class="bottom">
                <button on:click={() => {target.close()}}>Ok</button>
            </div>
        </div>
  </dialog>
  
  <style>

button {
        /* text-wrap: nowrap; */
        max-width: unset;
        /* width: max-content !important; */
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
  </style>
  