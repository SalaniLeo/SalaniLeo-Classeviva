<script lang="ts">
    let { data } = $props()

    // let comunicazioni = data.ntte
    // let richiami = 
    console.log(data)
</script>

<div class="page padding2">
    {#each data.notes as nota}
        <p>A</p>
    {/each}
</div>
