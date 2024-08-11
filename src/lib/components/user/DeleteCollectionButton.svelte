<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { BookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";


    export let collection: BookCollectionWithEntireBooks
    export let onDelete: () => void

    const modalStore = getModalStore()
    const toastStore = getToastStore()

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

    async function onDeleteCollection() {
        if (collection.books.length > 0) {
            modalStore.trigger(deleteCollectionModal)
        }
        else {
            await deleteCollection()
        }
    }

    async function deleteCollection() {
        const response = await fetch(`/api/book-collection/${collection.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (response.status == HttpCodes.Success) {
            await invalidateAll()
            onDelete()
        } else {
            toastStore.trigger({
                message: "Failed to delete collection",
                background: "variant-filled-error"
            })
        }

    }
</script>

<button class="btn-icon variant-ghost-error" on:click={onDeleteCollection}>
    <Icon icon="mdi:delete" width="16" height="16"/>
</button>
