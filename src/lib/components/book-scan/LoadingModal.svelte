<script lang="ts">
    import { getModalStore, ProgressRadial } from "@skeletonlabs/skeleton";
    import type { SvelteComponent } from "svelte";

    export let parent: SvelteComponent


    const modalStore = getModalStore()
</script>

{#if $modalStore[0]}
	<div class="card p-8 w-modal-slim shadow-xl flex justify-between">
		<header class="text-2xl font-bold">Fetching Book Data...</header>

        <ProgressRadial
            width="w-8"
            meter="stroke-secondary-500"
            track="stroke-secondary-500/30"
        />
    </div>
{/if}
