<script lang="ts">
    import Icon from "@iconify/svelte";
    import { Ratings } from "@skeletonlabs/skeleton"

    let { rating = 0 }: {
        rating?: number
    } = $props()
</script>

<Ratings value={rating} max={5} spacing="space-x-0" class="!w-fit">
    <svelte:fragment slot="empty">
        <Icon icon="material-symbols:star" width="16" height="16" color="#c2c7cc"/>
    </svelte:fragment>
    <svelte:fragment slot="half">
        <Icon icon="material-symbols:star-half" width="16" height="16" color="#e87400" />
    </svelte:fragment>
    <svelte:fragment slot="full">
        <Icon icon="material-symbols:star" width="16" height="16" color="#e87400" />
    </svelte:fragment>
</Ratings>
