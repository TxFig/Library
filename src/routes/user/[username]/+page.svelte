<script lang="ts">
    import { ReadingState } from "@prisma/client";
    import type { PageData } from "./$types";
    import CreateNewCollectionButton from "$lib/components/user/CreateNewCollectionButton.svelte";
    import type { BookCollectionWithBooks } from "$lib/server/database/books/collection";
    import BookCollection from "$lib/components/user/BookCollection.svelte";
    import BuiltInBookCollection from "$lib/components/user/BuiltInBookCollection.svelte";

    export let data: PageData
    const { pageUser, isCurrentUser } = data


    const BooksReadingCollection: Omit<BookCollectionWithBooks, "id"> = {
        name: "Books Reading",
        books: pageUser.userBookReadingState
            .filter(readingState => readingState.state === ReadingState.READING)
            .map(readingState => readingState.book),

        ownerId: pageUser.id
    }
    const BooksReadCollection: Omit<BookCollectionWithBooks, "id"> = {
        name: "Books Read",
        books: pageUser.userBookReadingState
            .filter(readingState => readingState.state === ReadingState.READ)
            .map(readingState => readingState.book),

        ownerId: pageUser.id
    }

    let bookCollections = pageUser.bookCollections
    function onCreatedBookCollection(collection: BookCollectionWithBooks) {
        bookCollections = [...bookCollections, collection]
    }

    function onDeleteBookCollection(collection: BookCollectionWithBooks) {
        bookCollections = bookCollections.filter(bookCollection => bookCollection.id !== collection.id)
    }

</script>

<p class="text-2xl">{pageUser.username}</p>
<p>{pageUser.permissionGroup.name}</p>

{#if pageUser.userSettings?.visibleReadingState || isCurrentUser}
    {#if BooksReadingCollection.books.length > 0}
        <BuiltInBookCollection collection={BooksReadingCollection} />
    {/if}
    {#if BooksReadCollection.books.length > 0}
        <BuiltInBookCollection collection={BooksReadCollection} />
    {/if}
{/if}

{#if isCurrentUser}
    <hr class="my-4" />
    <div class="flex items-center gap-2">
        <p class="text-xl">Collections</p>
        <CreateNewCollectionButton {onCreatedBookCollection}/>
    </div>
    <div class="flex flex-col gap-2">
        {#each bookCollections as collection}
            <BookCollection collection={collection} onDelete={() => onDeleteBookCollection(collection)} />
        {/each}
    </div>
{/if}
