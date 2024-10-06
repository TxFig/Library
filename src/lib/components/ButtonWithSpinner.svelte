<script lang="ts">
    import { ProgressRadial } from "@skeletonlabs/skeleton"

    let loading = false

    let externalClasses: string | undefined = undefined
    export { externalClasses as class }
</script>

<button
    class="btn variant-filled relative w-full {externalClasses}"
    on:click={() => { loading = true }}
    disabled={loading}
>
    {#if loading}
        <ProgressRadial
            width="w-6"
            meter="stroke-primary-500"
            track="stroke-primary-500/50"

        />
    {:else}
        <slot />
    {/if}
</button>
