<script lang="ts">
    import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore, popup, type ModalSettings, type PopupSettings } from "@skeletonlabs/skeleton";


    export let collection: BookCollectionWithBooks
    export let onDelete: () => void


    const modalStore = getModalStore()
    const toastStore = getToastStore()

    const collectionOptionPopup: PopupSettings = {
        event: "click",
        target: `CollectionOptionPopup-${collection.id}`,
        placement: "right"
    }


    let collectionName = collection.name
    const editCollectionModal: ModalSettings = {
        type: "prompt",
        title: "Update Collection",
        body: "Provide the new collection name in the field below.",
        value: collectionName,
        valueAttr: { type: "text", minlength: 3, maxlength: 10, required: true },
        response: (response: false | string) => {
            if (response) {
                editCollection(response)
            }
        },
    }

    async function editCollection(newName: string) {
        const response = await fetch(`/api/book-collection/${collection.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newName })
        })

        if (response.status == HttpCodes.Success) {
            collectionName = newName
        }
        else
            toastStore.trigger({
                message: "Failed to update collection",
                background: "variant-filled-error"
            })
    }

    function onEditCollection() {
        modalStore.trigger(editCollectionModal)
    }

    const deleteCollectionModal: ModalSettings = {
        type: "confirm",
        title: "Delete Collection Confirmation",
        body: "Are you sure you want to delete this collection?",
        async response(response: boolean) {
            if (response) {
                await deleteCollection()
            }
        },
    }

    function onDeleteCollection() {
        modalStore.trigger(deleteCollectionModal)
    }

    async function deleteCollection() {
        const response = await fetch(`/api/book-collection/${collection.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (response.status == HttpCodes.Success) {
            onDelete()
        } else {
            toastStore.trigger({
                message: "Failed to delete collection",
                background: "variant-filled-error"
            })
        }

    }

</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token relative">
    <legend class="px-2 flex gap-2 items-center">
        <span>{collectionName}</span>
        <button class="btn-icon btn-icon-sm variant-soft-surface aspect-auto" use:popup={collectionOptionPopup}>
            <Icon icon="tabler:dots" width="18" height="18" />
        </button>
        <div class="card p-4 variant-glass-surface z-10" data-popup={`CollectionOptionPopup-${collection.id}`}>
            <div class="arrow variant-filled-surface" />
            <div class="flex gap-2">
                <button class="btn-icon variant-ghost-secondary" on:click={onEditCollection}>
                    <Icon icon="mdi:pencil" width="16" height="16"/>
                </button>
                <button class="btn-icon variant-ghost-error" on:click={onDeleteCollection}>
                    <Icon icon="mdi:delete" width="16" height="16"/>
                </button>
            </div>
        </div>
    </legend>
    <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
        {#if collection.books.length === 0}
            <p class="text-center text-surface-400">No books in this collection</p>
        {:else}
            {#each collection.books as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
        {/if}
    </div>
</fieldset>
