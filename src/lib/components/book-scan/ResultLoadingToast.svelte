<script lang="ts">
    import { ProgressRadial } from "@skeletonlabs/skeleton";


    let { isbn, promise }: {
        isbn: string
        promise: Promise<void>
    } = $props()

</script>

{#await promise}
    <div class="flex items-center gap-4 variant-ghost-secondary px-4 py-2 rounded-md">
        <ProgressRadial
            width="w-4 sm:w-8"
            meter="stroke-secondary-500"
            track="stroke-secondary-500/30"
        />
        <span class="text-sm sm:text-base text-nowrap">Loading {isbn}</span>
    </div>
{/await}
