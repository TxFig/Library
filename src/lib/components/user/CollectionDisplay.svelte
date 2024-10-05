<script lang="ts">
    import type { BookCollectionWithBooks, BuiltInBookCollectionWithBooks } from "$lib/server/database/books/types";

    export let collection: BookCollectionWithBooks | BuiltInBookCollectionWithBooks
</script>

<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
    {#if collection.books.length === 0}
        <p class="text-center text-surface-400">No books in this collection</p>
    {:else}
        {#each collection.books as book}
            {#if book.image.length === 0}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card w-24 flex justify-center items-center p-2 text-center">
                    {book.title}
                </a>
            {:else}
                {@const smallestImage = book.image.sort((a, b) => a.height - b.height)[0]}
                <a
                    href={`/book/${book.isbn}`}
                    class="snap-start shrink-0 card p-2 w-24 text-center flex flex-col justify-between gap-2"
                >
                    <img src={`/images/${book.isbn}/${smallestImage.height}.webp`} alt={book.title} />
                    <span class="text-sm leading-none">{book.title}</span>
                </a>
            {/if}
        {/each}
    {/if}
</div>
