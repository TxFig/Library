<script lang="ts">
    import { ReadingState } from "@prisma/client";
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte";
    import CreateNewCollectionButton from "$lib/components/user/CreateNewCollectionButton.svelte";
    import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";

    export let data: PageData
    const { pageUser, isCurrentUser } = data



    const booksReading = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READING)
        .map(readingState => readingState.book)
    const booksRead = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READ)
        .map(readingState => readingState.book)

    let bookCollections = pageUser.bookCollections
    function onCreatedBookCollection(collection: BookCollectionWithBooks) {
        bookCollections = [...bookCollections, collection]
    }

</script>

<p class="text-2xl">{pageUser.username}</p>
<p>{pageUser.permissionGroup.name}</p>

{#if pageUser.userSettings?.visibleReadingState || isCurrentUser}
    {#if booksReading.length > 0}
        <hr class="my-4" />
        <p>Books Reading:</p>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
            {#each booksReading as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
        </div>
    {/if}
    {#if booksRead.length > 0}
        <hr class="my-4" />
        <p>Books Read:</p>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
            {#each booksRead as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
        </div>
    {/if}
{/if}

{#if isCurrentUser}
    <hr class="my-4" />
    <div class="flex items-center gap-2">
        <p class="text-xl">Collections</p>
        <CreateNewCollectionButton {onCreatedBookCollection}/>
    </div>
    {#each bookCollections as bookCollection}
        <fieldset class="border border-surface-600 px-4 py-1 rounded-token">
            <legend class="px-1">{bookCollection.name}</legend>
            <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
                {#each bookCollection.books as book}
                    <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
                {/each}
                <button class="snap-start shrink-0 card py-12 w-24 btn">
                    <Icon icon="material-symbols:add" width="24" height="24" class="mx-auto" />
                </button>
            </div>
        </fieldset>
    {/each}
{/if}
