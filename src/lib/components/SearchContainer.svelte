<script lang="ts" generics="T">
    import { search } from "$lib/utils/search";
    import Icon from "@iconify/svelte";
    import type { Snippet } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements"


    let {
        options,
        optionSnippet,
        keys,
        selected = $bindable(),
        height = "max-h-52",
        ...rest
    }: {
        options: T[],
        optionSnippet: Snippet<[T]>
        keys: (keyof T)[] | string[]
        selected?: number
        height?: string
    } & HTMLInputAttributes  = $props()

    let query = $state("")
    let displayOptions = $derived(search(options, query, { keys: keys as string[] }))
</script>

<div class="flex flex-col gap-2">
    <div class="flex input-group items-center px-3">
        <Icon icon="mdi:search" height="24" />
        <input type="search" class="input [&::-webkit-search-cancel-button]:invert" bind:value={query} {...rest} />
    </div>

    <div class="flex flex-col border border-surface-600 rounded-container-token p-2 gap-2 overflow-auto {height}">
        {#each displayOptions as option}
            {@const index = options.indexOf(option)}
            <button
                type="button"
                class={[
                    "btn justify-start px-3",
                    {
                        "variant-filled": index === selected,
                        "hover:variant-ghost": index !== selected
                    }
                ]}
                onclick={() => selected = index}
            >
                {@render optionSnippet(option)}
            </button>
        {:else}
            <p class="text-center py-2 text-surface-300">No results found</p>
        {/each}
    </div>
</div>
