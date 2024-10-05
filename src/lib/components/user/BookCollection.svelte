<script lang="ts">
    import type { BookCollectionWithBooks } from "$lib/server/database/books/types";
    import Icon from "@iconify/svelte";
    import { getToastStore, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import DeleteCollectionButton from "./DeleteCollectionButton.svelte";
    import type { ApiJsonResponse } from "$lib/server/api";
    import HttpCodes from "$lib/utils/http-codes";
    import type { BookCollectionPatchMethodReturn } from "$lib/server/api/book-collection/PATCH";
    import CollectionDisplay from "./CollectionDisplay.svelte";


    const toastStore = getToastStore()

    export let collection: BookCollectionWithBooks
    export let onDelete: () => void


    const collectionOptionPopup: PopupSettings = {
        event: "click",
        target: `CollectionOptionPopup-${collection.id}`,
        placement: "right",
    }

    let newName: string = collection.name
    function onCancel() {
        isEditing = false
        newName = collection.name
    }

    async function onNameSet() {
        const response = await fetch(`/api/book-collection/${collection.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName })
        })

        const json: ApiJsonResponse<BookCollectionPatchMethodReturn> = await response.json()
        if (json.status === HttpCodes.Success) {
            collection.name = newName
            isEditing = false
        }
        else {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error",
            })
        }
    }

    function onKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault()
            onNameSet()
        }
    }

    let isEditing = false
</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token w-full">
    <legend class="px-2 flex gap-2 items-center">
        {#if isEditing}
            <input
                type="text"
                class="
                    focus:ring-transparent bg-transparent
                    border-0 border-b focus:!border-b-primary-400
                    w-40 text-sm duration-300 transition-colors
                "
                placeholder="Name..."
                bind:value={newName}
                on:keypress={onKeyPress}
                autofocus
            />
            <button class="btn-icon btn-icon-sm variant-soft-success" on:click={onNameSet}>
                <Icon icon="tabler:check" width="16" height="16" />
            </button>
            <button class="btn-icon btn-icon-sm variant-soft-error" on:click={onCancel}>
                <Icon icon="tabler:x" width="16" height="16" />
            </button>
        {:else}
            <span>{collection.name}</span>
        {/if}
        <button class="btn-icon btn-icon-sm variant-soft-surface aspect-auto" use:popup={collectionOptionPopup} disabled={isEditing}>
            <Icon icon="tabler:dots" width="18" height="18" />
        </button>
        <div class="card p-4 variant-glass-surface z-10" data-popup={`CollectionOptionPopup-${collection.id}`}>
            <div class="arrow variant-filled-surface" />
            <div class="flex gap-2">
                <button class="btn-icon variant-ghost-secondary" on:click={() => isEditing = true}>
                    <Icon icon="mdi:pencil" width="16" height="16"/>
                </button>
                <!-- <button class="btn-icon variant-ghost-tertiary">
                    <Icon icon="mdi:eye" width="16" height="16"/>
                </button> -->
                <DeleteCollectionButton {collection} {onDelete} />
            </div>
        </div>
    </legend>
    <CollectionDisplay {collection} />
</fieldset>
