<script lang="ts">
    import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";

    export let collection: Omit<BookCollectionWithBooks, "id">
</script>

<fieldset class="border border-surface-600 px-4 py-1 rounded-token">
    <legend class="px-1">{collection.name}</legend>
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
