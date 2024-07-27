<script lang="ts">
    import { invalidate, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import type { ApiJsonResponse } from "$lib/server/api";
    import type { BookCollectionAddBookPostMethodReturn } from "$lib/server/api/book-collection/add-book/POST";
    import HttpCodes from "$lib/utils/http-codes";
    import { ListBox, ListBoxItem, getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import type { SvelteComponent } from "svelte";

    export let parent: SvelteComponent

    export let isbn: string


    const modalStore = getModalStore()
    const toastStore = getToastStore()

    async function addToCollection() {
        const response = await fetch(`/api/book-collection/add-book/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                collectionName: selected,
                isbn
            })
        })

        const json: ApiJsonResponse<BookCollectionAddBookPostMethodReturn> = await response.json()

        if (json.status === HttpCodes.Success) {
            toastStore.trigger({
                message: "Book Successfully Added to Collection",
                background: "variant-filled-success"
            })
            await invalidateAll()
            parent.onClose()
        } else {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error"
            })
        }
    }

    let selected = ""
    let bookCollectionsWithoutCurrentBook = $page.data.user ? $page.data.user.bookCollections.filter(
        collection => collection.books.every(book => book.isbn !== isbn)
    ) : []
</script>

{#if $modalStore[0]}
    <div class="card p-4 w-modal shadow-xl space-y-4">
        <p class="text-xl">Add to Collection</p>
        {#if bookCollectionsWithoutCurrentBook.length > 0}
            <p class="text-sm">Select a collection to add this book to.</p>
        {/if}
        {#if $page.data.user}
            <ListBox>
                {#if bookCollectionsWithoutCurrentBook.length === 0}
                    <p class="variant-ringed-error px-3 py-1">You don't have any collections to add this book to.</p>
                {:else}
                    {#each bookCollectionsWithoutCurrentBook as collection}
                        <ListBoxItem bind:group={selected} name="collectionList" value={collection.name}>{collection.name}</ListBoxItem>
                    {/each}
                {/if}
            </ListBox>
            <footer class="modal-footer {parent.regionFooter}">
                <button
                    class="btn {parent.buttonNeutral}"
                    on:click={parent.onClose}
                >{parent.buttonTextCancel}</button>
                <button
                    class="btn {parent.buttonPositive}"
                    on:click={addToCollection}
                    disabled={bookCollectionsWithoutCurrentBook.length === 0 || selected === ""}
                >Add to Collection</button>
            </footer>
        {:else}
            <p>You must be logged in to add books to collections</p>
        {/if}
    </div>
{/if}
