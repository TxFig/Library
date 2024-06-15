<script lang="ts">
    import { page } from "$app/stores";
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

        if (response.status == HttpCodes.Success) {
            toastStore.trigger({
                message: "Book Successfully Added to Collection",
                background: "variant-filled-success"
            })
            $modalStore[0].response?.(true)
        } else {
            toastStore.trigger({
                message: "Failed to add book to collection",
                background: "variant-filled-error"
            })
            $modalStore[0].response?.(false)
        }
    }

    let selected = ""

</script>

{#if $modalStore[0]}
    <div class="card p-4 w-modal shadow-xl space-y-4">
        <p class="text-xl">{$modalStore[0].title}</p>
        <p class="text-sm">{$modalStore[0].body}</p>
        {#if $page.data.user}
            <ListBox>
                {#each $page.data.user.bookCollections as collection}
                    <ListBoxItem bind:group={selected} name="collectionList" value={collection.name}>{collection.name}</ListBoxItem>
                {/each}
            </ListBox>
            <footer class="modal-footer {parent.regionFooter}">
                <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
                <button class="btn {parent.buttonPositive}" on:click={addToCollection}>Add to Collection</button>
            </footer>
        {:else}
            <p>You must be logged in to add books to collections</p>
        {/if}
    </div>
{/if}
