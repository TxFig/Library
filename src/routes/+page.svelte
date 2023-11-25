<script lang="ts">
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types"
    import FuzzySearch from "fuzzy-search"
    import type { Author, Book, Publisher } from "@prisma/client";


    export let data: PageData
    const { books, authors, publishers, languages, locations } = data

    function sortAlphabetically(arr: SearchItem[]): SearchItem[] {
        return arr // TODO
    }

    type SearchItem =
        ({ type: "book" } & Book) |
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

    const SEARCH_KEYS: (keyof Book | keyof Author | keyof Publisher)[] = ["title", "isbn", "name"]

    export async function search() {
        const arr = allResults.filter(
            item => filters[item.type]
        )

        if (searchQuery == "") {
            results = sortAlphabetically(arr)
            return
        }

        const searcher = new FuzzySearch(arr, SEARCH_KEYS, {
            sort: true
        })
        results = searcher.search(searchQuery)
    }

    let searchQuery: string = ""
    $: totalResults = results.length

    function filter(f: FilterKeys) {
        filters[f] = !filters[f]
        search()
    }

    const filterKeys = ["book", "author", "publisher"] as const
    type FilterKeys = typeof filterKeys[number]
    let filters: {[key in FilterKeys]: boolean} = {
        book: true,
        author: true,
        publisher: true
    }

    let languageFilter: string
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
    <div class="input-group-shim">
        <Icon icon="material-symbols:search-rounded" width="24" height="24" />
    </div>
    <input
        type="search"
        placeholder="Search books, authors, publishers, ..."
        bind:value={searchQuery}
        on:input={search}
    />
</div>

<div class="flex flex-col my-4 gap-1">
    <p>Filters:</p>

    <div class="flex gap-2 items-center">
        <div class="flex gap-2 h-fit">
            {#each filterKeys as f}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span
                    class="chip {filters[f] ? 'variant-filled' : 'variant-soft'}"
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
        <!--
            <select class="select w-fit" bind:value={languageFilter} on:change={search}>
                <option value="" selected hidden>Language</option>
                <option value="all">All</option>
                {#each languages as lang}
                    <option value="{lang.id}">{lang.value}</option>
                {/each}
            </select>
        -->
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
            <a href={"/book/" + item.isbn} class="flex flex-col items-center justify-center">
                {#if item.front_image}
                    <img
                        src={`/images/${item.front_image}`}
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
                <Icon icon="gis:globe-user" color="#fbe7d1" width="150" class="mb-1"/>
                <span class="!no-underline hover:!underline">{item.name}</span>
            </a>
        {/if}
    {/each}
</div>
