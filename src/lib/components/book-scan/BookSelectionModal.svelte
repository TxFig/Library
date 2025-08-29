<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import SearchContainer from "../SearchContainer.svelte";
    import { type SvelteComponent } from "svelte";
    import type { ScanPage } from "$lib/types";
    import BookEditionImage from "../BookEditionImage.svelte";


    let { parent, books, selected }: {
        parent: SvelteComponent
        books: ScanPage.BookWithEditions[]
        selected: ScanPage.BookWithEditions
    } = $props()

    const modalStore = getModalStore()

    let bookIndex = $state<number>()
    if (selected) {
        bookIndex = books.findIndex(book => book.id === selected.id)
    }

    function response() {
        if (bookIndex === undefined) return
        $modalStore[0]?.response?.(books[bookIndex])
        modalStore.close()
    }

    function clear() {
        $modalStore[0]?.response?.("clear")
        modalStore.close()
    }
</script>

{#snippet bookSnippet(book: ScanPage.BookWithEditions)}
    {@const edition = book.editions[0]}
    <div class="flex gap-2">
        <BookEditionImage
            bookId={book.id}
            editionId={edition.id}
            heights={edition.image}
            class="h-24 variant-outline-surface"
        />
        <div class="flex flex-col justify-between items-start">
            <div class="flex flex-col gap-1 items-start">
                <p class="font-bold">{edition.title}</p>
                <p class="text-sm">{book.authors.join(", ")}</p>
            </div>
            <p class="text-sm">{book.editions.length} edition(s)</p>
        </div>
    </div>
{/snippet}

{#if $modalStore[0]}
    <div class="card p-6 w-modal shadow-xl flex flex-col justify-between gap-6">
        <div class="flex justify-between items-center">
            <h3 class="h3">Select Edition</h3>
            <button type="button" class="btn-icon" onclick={() => parent.onClose()}>
                <Icon icon="mdi:close" height="16" />
            </button>
        </div>

        <SearchContainer
            options={books}
            optionSnippet={bookSnippet}
            placeholder="Search books..."
            keys={["authors", "editions.title", "edition.subtitle"]}
            bind:selected={bookIndex}
        />

        <footer class="modal-footer flex justify-between">
            <button type="button" class="btn variant-outline" onclick={() => clear()}>Clear</button>
            <button
                type="button"
                class="btn variant-filled-primary"
                onclick={() => response()}
                disabled={bookIndex === undefined}
            >
                <Icon icon="mdi:check" height="16" />
                <span>Select</span>
            </button>
        </footer>
    </div>
{/if}
