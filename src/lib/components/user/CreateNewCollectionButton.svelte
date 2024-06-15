<script lang="ts">
    import type { BookCollectionPostResponse } from "@api/book-collection/+server";
    import Icon from "@iconify/svelte";
    import { getToastStore, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import HttpCodes from "$lib/utils/http-codes"
    import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";

    export let onCreatedBookCollection: (collection: BookCollectionWithBooks) => void

    const createNewCollectionPopup: PopupSettings = {
        event: "click",
        target: "CreateNewCollectionPopup",
        placement: "right"
    }

    const toastStore = getToastStore()

    let nameElement: HTMLInputElement
    async function createNewCollection() {
        const response = await fetch("/api/book-collection", {
            method: "POST",
            body: JSON.stringify({
                name: nameElement.value
            })
        })

        const data: BookCollectionPostResponse = await response.json()
        if (data.status == HttpCodes.Success) {
            nameElement.value = ""
            onCreatedBookCollection(data.createdBookCollection)
        }
        else {
            toastStore.trigger({
                message: data.message,
                background: "variant-filled-error"
            })
        }
    }
</script>

<button class="btn-icon btn-icon-sm variant-outline-primary" use:popup={createNewCollectionPopup}>
    <Icon icon="fluent:collections-24-regular" width="20" height="20" />
</button>

<div class="card p-4 variant-glass-surface z-10" data-popup="CreateNewCollectionPopup">
    <div class="arrow variant-filled-surface" />
    <div class="flex flex-col gap-2">
        <p>Name:</p>
        <input
            type="text"
            class="input"
            name="name"
            placeholder="My new collection..."
            bind:this={nameElement}
        />
        <button class="btn variant-ghost-secondary" on:click={createNewCollection}>
            <Icon icon="material-symbols:add" width="24" height="24" />
            <span>Create</span>
        </button>
    </div>
</div>
