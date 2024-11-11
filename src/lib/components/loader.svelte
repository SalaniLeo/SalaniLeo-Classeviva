<script lang="ts">

</script>

<main>
    <div class="halign valign page">
        <div class="indicator"></div>
    </div>
</main>

<style>
    .indicator {
        width: 30px;
        height: 30px;
        background-color: var(--card-color);
        border-radius: 50%;
        animation: bounce 1s infinite;
    }

    @keyframes bounce {
        0% {
            transform: translateY(0%);
            width: 40px;
            height: 25px;
            border-radius: 30%;
        }
        50% {
            border-radius: 50%;
            width: 30px;
            height: 35px;
            transform: translateY(-200%);
        }
        100% {
            border-radius: 30%;
            width: 40px;
            height: 25px;
            transform: translateY(0%);
        }
    }
</style>