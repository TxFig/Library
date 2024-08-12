<script lang="ts">
    import { invalidate, invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import type { ApiJsonResponse } from "$lib/server/api";
    import type { BookCollectionPostMethodReturn } from "$lib/server/api/book-collection/POST";
    import type { BookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import HttpCodes from "$lib/utils/http-codes";
    import Icon from "@iconify/svelte";
    import { getToastStore } from "@skeletonlabs/skeleton";


    const toastStore = getToastStore()

    export let onCreate: (newCollection: BookCollectionWithEntireBooks) => void
    export let onCancel: () => void

    let name: string = ""

    async function onNameSet() {
        const response = await fetch("/api/book-collection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                ownerId: $page.data.user!.id
            })
        })

        const json: ApiJsonResponse<BookCollectionPostMethodReturn> = await response.json()
        if (json.status === HttpCodes.Success) {
            await invalidateAll()
            onCreate(json.data)
        }
        else {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error",
            })
        }
    }

    function onKeyPress(event: KeyboardEvent) {
        if (!name) return
        if (event.key === "Enter") {
            event.preventDefault()
            onNameSet()
        }
    }
</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token relative">
    <legend class="px-2 flex gap-2 items-center">
        <input
            type="text"
            class="
                focus:ring-transparent bg-transparent
                border-0 border-b focus:!border-b-primary-400
                w-60 text-sm duration-300 transition-colors
            "
            placeholder="Name..."
            bind:value={name}
            on:keypress={onKeyPress}
            autofocus
        />
        <button class="btn-icon btn-icon-sm variant-soft-success" on:click={onNameSet} disabled={!name}>
            <Icon icon="tabler:check" width="16" height="16" />
        </button>
        <button class="btn-icon btn-icon-sm variant-soft-error" on:click={onCancel}>
            <Icon icon="tabler:x" width="16" height="16" />
        </button>
        <button class="btn-icon btn-icon-sm variant-soft-surface aspect-auto" disabled>
            <Icon icon="tabler:dots" width="18" height="18" />
        </button>
    </legend>
    <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
        <p class="text-center text-surface-400">No books in this collection</p>
    </div>
</fieldset>
