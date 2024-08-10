<script lang="ts" generics="T extends Record<string, any>">
    import Icon from "@iconify/svelte";
    import { search, type SearchOptions } from "$lib/utils/search";

    export let allValues: T[]
    export let values: T[]
    export let options: SearchOptions<T>
    export let placeholder: string = "Search..."

    const defaultOptions: SearchOptions<T> = {
        threshold: 0.25,
        distance: 10,
        ignoreLocation: true,
    }

    let searchQuery: string = ""
    function onQueryChange() {
        const combinedOptions = {...defaultOptions, ...options}
        values = search(allValues, searchQuery, combinedOptions)
    }

    export const update = onQueryChange
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim">
        <Icon icon="material-symbols:search-rounded" width="24" height="24" />
    </div>
    <input
        type="search"
        placeholder={placeholder}
        bind:value={searchQuery}
        on:input={onQueryChange}
        class="[&::-webkit-search-cancel-button]:invert"
    />
</div>