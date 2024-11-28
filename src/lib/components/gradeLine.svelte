<script lang="ts">
    let { number } = $props()

    let maxwidth = 125

    function calculateLineWidth(value: number) {
      value = Math.max(0, Math.min(10, value));
      return (value / 10) * maxwidth;
    }
</script>

<style>
    .line {
        height: 20px;
        border-radius: var(--border-radius-heavy);
        /* background-color: #3498db; */
        /* margin: 5px 0; */
    }
    .bg {
        height: fit-content;
        background-color: var(--secondary-color);
        border-radius: var(--border-radius-heavy);
    }
</style>

<div class="bg valign" style="min-width: {maxwidth}px;">
    <div
        class="line halign valign"
        style="width: {calculateLineWidth(number)}px;"
        title="Value: {number}"
        class:ok={number >= 6} 
            class:alert={number < 6 && number >= 5}
        >
        {number}
    </div>
</div>
