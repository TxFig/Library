<script lang="ts">
    import type { RatingUpdateSchemaInput } from '$lib/validation/book/rating';
    import Icon from '@iconify/svelte';
    import { Ratings } from '@skeletonlabs/skeleton'


    let {
        rating = $bindable(),
        editionId
    }: {
        rating?: number,
        editionId: string
    } = $props()


    async function updateRating() {
        if (rating === undefined || rating === 0) return

        await fetch(`/api/editions/${editionId}/rating`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rating,
            } satisfies RatingUpdateSchemaInput),
        })
    }

    async function iconClick(event: CustomEvent<{ index:number }>): Promise<void> {
        if (event.detail.index === rating) return
        rating = event.detail.index
        await updateRating()
    }
</script>

<Ratings bind:value={rating} max={5} interactive on:icon={iconClick}>
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
