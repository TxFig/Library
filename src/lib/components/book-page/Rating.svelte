<script lang="ts">
    import Icon from '@iconify/svelte';
    import { Ratings } from '@skeletonlabs/skeleton'

    export let rating: number | null

    let value = rating || 0;
</script>

<div class="max-w-sm">
    <Ratings value={value} max={5}>
        <svelte:fragment slot="empty">
            <Icon icon="material-symbols:star" width="32" height="32" color="#c2c7cc"/>
        </svelte:fragment>
        <svelte:fragment slot="half">
            <Icon icon="material-symbols:star-half" width="32" height="32" color="#e87400" />
        </svelte:fragment>
        <svelte:fragment slot="full">
            <Icon icon="material-symbols:star" width="32" height="32" color="#e87400" />
        </svelte:fragment>
    </Ratings>
</div>
