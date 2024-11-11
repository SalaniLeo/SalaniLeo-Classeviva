<script lang="ts">
	import Comunicazione from "$lib/components/comunicazioni/comunicazione.svelte";

    let { data } = $props()

    let showToRead = $state(false)

    function showToReadFun() {
        showToRead = !showToRead
    }
</script>

<!-- <h2>Bacheca</h2> -->
<div class="flexrow space-between padding2">
    <div class="flexrow gap-small hide1"></div>
    <div class="flexrow gap-small valign">
        <label class="custom-checkbox" style="transform: translateY(-2px);">
            <!-- svelte-ignore event_directive_deprecated -->
            <input type="checkbox" checked={showToRead} on:click={showToReadFun}>
            <span class="checkmark"></span>
        </label>
        <p>Da leggere</p>
    </div>
</div>
<div class="content page padding1">
    <div class="flexcolumn">
        <div class="flexcolumn gap-small scrollview padding1">
            {#each data.noticeBoard as item, i}
                {#if showToRead}
                    {#if !item.readStatus}
                        <Comunicazione item={item} i={i/5}></Comunicazione>
                    {/if}
                {:else}
                    <Comunicazione item={item} i={i}></Comunicazione>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    p {
        margin: 0;
    }
</style>