<script lang="ts">
    import { ReadingState } from "@prisma/client";
    import type { PageData } from "./$types";

    export let data: PageData
    const { pageUser } = data

    const booksReading = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READING)
        .map(readingState => readingState.book)
    const booksRead = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READ)
        .map(readingState => readingState.book)

</script>

<p class="text-2xl">{pageUser.username}</p>
<p>{pageUser.permissionGroup.name}</p>

{#if pageUser.userSettings?.visibleReadingState}
    {#if booksReading.length > 0}
        <hr class="my-4" />
        <p class="text-xl">Books Reading:</p>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
            {#each booksReading as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
        </div>
    {/if}
    {#if booksRead.length > 0}
        <hr class="my-4" />
        <p class="text-xl">Books Read:</p>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
            {#each booksRead as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
        </div>
    {/if}
{/if}
