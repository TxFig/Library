<script lang="ts">
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types"
    import type { Author, Publisher } from "@prisma/client";
    import { type SearchOptions } from "$lib/utils/search";
    import type { FuseOptionKey } from "fuse.js"
    import SearchBar from "$lib/components/SearchBar.svelte";
    import type { BookWithSearchProperties } from "$lib/server/database/books/types";


    export let data: PageData
    const { books, authors, publishers } = data

    type SearchItem =
        ({ type: "book" } & BookWithSearchProperties) |
        ({ type: "author" } & Author) |
        ({ type: "publisher" } & Publisher)

    const allResults: SearchItem[] = [
        ...books.map(book => ({
            type: "book" as const,
            ...book
        })),
        ...authors.map(author => ({
            type: "author" as const,
            ...author
        })),
        ...publishers.map(publisher => ({
            type: "publisher" as const,
            ...publisher
        }))
    ]
    let results: SearchItem[] = allResults

    const searchKeys: FuseOptionKey<SearchItem>[] = [
        "title", "isbn", "isbn10", "isbn13", "name",
        { name: "subjects.value", weight: 0.25 },
        "language.value", "location.value"
    ]
    const searchOptions: SearchOptions<SearchItem> = {
        keys: searchKeys,
        filter: (item) => filters[item.type]
    }
    let searchBar: SearchBar<SearchItem>
    $: totalResults = results.length

    function filter(f: FilterKeys) {
        filters[f] = !filters[f]
        searchBar.update()
    }

    const filterKeys = ["book", "author", "publisher"] as const
    type FilterKeys = typeof filterKeys[number]
    let filters: {[key in FilterKeys]: boolean} = {
        book: true,
        author: true,
        publisher: true
    }
</script>

<div class="p-6">
    <SearchBar
        allValues={allResults}
        bind:values={results}
        options={searchOptions}
        bind:this={searchBar}
        placeholder="Search books, authors, publishers, ..."
    />

    <div class="flex flex-col my-4 gap-1">
        <p>Filters:</p>

        <div class="flex gap-2 items-center">
            <div class="flex gap-2 h-fit">
                {#each filterKeys as f}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <span
                        class="chip {filters[f] ? 'variant-filled' : 'variant-outline'}"
                        on:click={() => { filter(f) }}
                        on:keypress
                    >
                        {#if filters[f]}
                            <Icon icon="material-symbols:check"/>
                        {/if}
                        <span class="capitalize">{f}s</span>
                    </span>
                {/each}
            </div>
        </div>
    </div>

    <p>Total Results: {totalResults}</p>
    <div
        class="
            grid
            grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10
            gap-5 py-10 px-5 justify-items-center"
    >
        {#each results as item}
            {#if item.type == "book"}
                {@const smallestImage = item.image.sort((a, b) => a.width - b.width)[0]}

                <a href={"/book/" + item.isbn} class="flex flex-col items-center justify-center">
                    {#if item.image.length > 0}
                        <img
                        src={`/images/${item.isbn}/${smallestImage.height}.webp`}
                            alt={item.title}
                            class="mb-1"
                            loading="lazy"
                        />
                    {:else}
                        <Icon icon="material-symbols:book-outline" color="#fbe7d1" width="150" class="mb-1"/>
                    {/if}
                    <span class="!no-underline hover:!underline">{item.title}</span>
                </a>
            {:else if item.type == "author"}
            <a href={"/author/" + item.name} class="flex flex-col items-center justify-center">
                <Icon icon="material-symbols:person-sharp" color="#fbe7d1" width="150" class="mb-1"/>
                <span class="!no-underline hover:!underline">{item.name}</span>
            </a>
            {:else if item.type == "publisher"}
                <a href={"/publisher/" + item.name} class="flex flex-col items-center justify-center">
                    <Icon icon="mdi:office-building" color="#fbe7d1" width="150" class="mb-1"/>
                    <span class="!no-underline hover:!underline">{item.name}</span>
                </a>
            {/if}
        {/each}
    </div>
</div>
