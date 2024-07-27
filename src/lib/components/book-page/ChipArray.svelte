<script lang="ts">
    export let data: string[]
    export let href: string | undefined = undefined
    export let limit: number = 6
    export let variant = "variant-ringed-primary"
</script>

<div class="flex gap-2 flex-wrap">
    {#each data.slice(0, limit) as value}
        {#if href}
            <a class="chip {variant}" href="{href}/{value}">{value}</a>
        {:else}
            <span class="chip {variant}">{value}</span>
        {/if}
    {/each}
    {#if data.length > limit}
        <button class="chip variant-ringed-tertiary px-4" on:click={() => limit = Infinity}>
            More...
        </button>
    {/if}
</div>
