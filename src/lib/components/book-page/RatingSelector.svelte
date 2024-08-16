<script lang="ts">
    import type { RatingUpdateData } from '$lib/validation/book/rating';
    import Icon from '@iconify/svelte';
    import { RangeSlider, Ratings } from '@skeletonlabs/skeleton'

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
</script>

<div class="max-w-sm">
    <p>Rating: {value}</p>

    <Ratings value={value} max={5} justify="justify-evenly">
        <svelte:fragment slot="empty">
            <Icon icon="material-symbols:star-outline" width="32" height="32" />
        </svelte:fragment>
        <svelte:fragment slot="half">
            <Icon icon="material-symbols:star-half" width="32" height="32" />
        </svelte:fragment>
        <svelte:fragment slot="full">
            <Icon icon="material-symbols:star" width="32" height="32" />
        </svelte:fragment>
    </Ratings>
    <RangeSlider name="" bind:value={value} max={5} step={0.5} ticked on:change={updateRating} />
</div>
