<script lang="ts">
    import type { RatingUpdateData } from '$lib/validation/book/rating';
    import Icon from '@iconify/svelte';
    import { Ratings } from '@skeletonlabs/skeleton'

    export let rating: number | null
    export let bookId: number

    let value = rating || 0;

    async function updateRating() {
        const updateData: RatingUpdateData = {
            rating: value,
            bookId
        }

        await fetch(`/api/rating/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        })
    }

    async function iconClick(event: CustomEvent<{index:number}>): Promise<void> {
        value = event.detail.index
        await updateRating()
    }
</script>

<div class="max-w-sm space-y-2">
    <Ratings bind:value={value} max={5} interactive on:icon={iconClick}>
        <svelte:fragment slot="empty">
            <Icon icon="material-symbols:star-outline" width="32" height="32" color="#c2c7cc"/>
        </svelte:fragment>
        <svelte:fragment slot="half">
            <Icon icon="material-symbols:star-half" width="32" height="32" color="#e87400" />
        </svelte:fragment>
        <svelte:fragment slot="full">
            <Icon icon="material-symbols:star" width="32" height="32" color="#e87400" />
        </svelte:fragment>
    </Ratings>
    {#if value === 0}
        <p class="text-center">Rate this book</p>
    {/if}
</div>
