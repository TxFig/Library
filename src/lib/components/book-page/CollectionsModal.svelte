<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import type { ApiJsonResponse } from "$lib/server/api";
    import type { BookCollectionAddBookPostMethodReturn } from "$lib/server/api/book-collection/book/POST";
    import type { EntireBook } from "$lib/server/database/books/book";
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import { type SvelteComponent } from "svelte";
    import SearchBar from "../SearchBar.svelte";
    import type { SearchOptions } from "$lib/utils/search";
    import type { BookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import type { BookCollectionAddBookDeleteMethodReturn } from "$lib/server/api/book-collection/book/DELETE";


    export let parent: SvelteComponent
    export let isbn: string

    const modalStore = getModalStore()
    const toastStore = getToastStore()

    async function addBook(collectionName: string) {
        const response = await fetch(`/api/book-collection/book/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collectionName,
                isbn
            })
        })

        const json: ApiJsonResponse<BookCollectionAddBookPostMethodReturn> = await response.json()

        if (json.status === HttpCodes.Success) {
            // toastStore.trigger({
            //     message: "Book Successfully Added to Collection",
            //     background: "variant-filled-success"
            // })
            await updateAllCollections()
        } else {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error"
            })
        }
    }

    async function removeBook(collectionName: string) {
        const response = await fetch(`/api/book-collection/book/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collectionName,
                isbn
            })
        })

        const json: ApiJsonResponse<BookCollectionAddBookDeleteMethodReturn> = await response.json()

        if (json.status === HttpCodes.Success) {
            // toastStore.trigger({
            //     message: "Book Successfully Removed to Collection",
            //     background: "variant-filled-success"
            // })
            await updateAllCollections()
        } else {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error"
            })
        }
    }

    function hasBook(books: EntireBook[]): boolean {
        return books.some(book => book.isbn === isbn)
    }

    async function updateAllCollections() {
        await invalidateAll()
        allCollections = $page.data.user?.bookCollections ?? []
        searchBar.update(allCollections)
    }

    let allCollections = $page.data.user?.bookCollections ?? []
    let searchResults = allCollections

    let searchBar: SearchBar<BookCollectionWithEntireBooks>
    const searchOptions: SearchOptions<BookCollectionWithEntireBooks> = {
        keys: ["name"],
    }
</script>

{#if $modalStore[0]}
    <div class="card p-4 w-modal shadow-xl space-y-4">
        <p class="text-xl">Collections</p>
        {#if $page.data.user}
            {#if allCollections.length === 0}
                <p class="variant-ghost-error px-3 py-2">You don't have any collections.</p>
            {:else}
                <SearchBar
                    allValues={allCollections}
                    bind:values={searchResults}
                    options={searchOptions}
                    placeholder="Search collections..."
                    bind:this={searchBar}
                />
                <div class="overflow-y-auto max-h-[80vh]">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Add / Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each searchResults as collection}
                                <tr>
                                    <td>{collection.name}</td>
                                    <td>
                                        {#if hasBook(collection.books)}
                                            <button
                                                class="btn btn-sm variant-ghost-error w-28"
                                                on:click={() => removeBook(collection.name)}
                                            >
                                                <Icon icon="material-symbols:remove" />
                                                <span>Remove</span>
                                            </button>
                                        {:else}
                                            <button
                                                class="btn btn-sm variant-ghost-success w-28"
                                                on:click={() => addBook(collection.name)}
                                            >
                                                <Icon icon="material-symbols:add" />
                                                <span>Add</span>
                                            </button>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
            <footer class="modal-footer {parent.regionFooter}">
                <button
                    class="btn {parent.buttonNeutral}"
                    on:click={parent.onClose}
                >{parent.buttonTextCancel}</button>
                <!-- <button
                    class="btn {parent.buttonPositive}"
                    on:click={addToCollection}
                    disabled={bookCollectionsWithoutCurrentBook.length === 0 || selected === ""}
                >Add to Collection</button> -->
            </footer>
        {:else}
            <p>You must be logged in to add books to collections</p>
        {/if}
    </div>
{/if}
