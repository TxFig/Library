<script lang="ts">
    import type { PageData } from "./$types";
    import type { BookCollectionWithEntireBooks, BuiltInBookCollectionWithEntireBooks } from "$lib/server/database/books/collection";
    import BookCollection from "$lib/components/user/BookCollection.svelte";
    import BuiltInBookCollection from "$lib/components/user/BuiltInBookCollection.svelte";
    import Icon from "@iconify/svelte";
    import BookCreateCollection from "$lib/components/user/BookCreateCollection.svelte";

    export let data: PageData
    const { pageUser, isCurrentUser } = data


    const BooksReadingCollection: BuiltInBookCollectionWithEntireBooks = {
        name: "Books Reading",
        books: pageUser.userBookReadingState
            .filter(readingState => readingState.state === "READING")
            .map(readingState => readingState.book),

        ownerId: pageUser.id
    }
    const BooksReadCollection: BuiltInBookCollectionWithEntireBooks = {
        name: "Books Read",
        books: pageUser.userBookReadingState
            .filter(readingState => readingState.state === "READ")
            .map(readingState => readingState.book),

        ownerId: pageUser.id
    }

    let bookCollections = pageUser.bookCollections
    function onDeleteBookCollection(collection: BookCollectionWithEntireBooks) {
        bookCollections = bookCollections.filter(bookCollection => bookCollection.id !== collection.id)
    }

    let creatingCollection = false
    function onCancelCollectionCreation() {
        creatingCollection = false
    }

    function onCreateCollection(newCollection: BookCollectionWithEntireBooks) {
        creatingCollection = false
        bookCollections = [newCollection, ...bookCollections]
    }
</script>

<div class="flex flex-col gap-4 p-6">
    <div>
        <p class="text-2xl">{pageUser.username}</p>
        <p>{pageUser.permissionGroup.name}</p>
    </div>

    {#if pageUser.userSettings?.visibleReadingState || isCurrentUser}
        {#if BooksReadingCollection.books.length > 0}
            <BuiltInBookCollection collection={BooksReadingCollection} />
        {/if}
        {#if BooksReadCollection.books.length > 0}
            <BuiltInBookCollection collection={BooksReadCollection} />
        {/if}
    {/if}

    {#if isCurrentUser}
        <hr />
        <div class="flex items-center gap-2">
            <p class="text-xl">Collections</p>
            <button
                class="btn-icon btn-icon-sm variant-outline-primary"
                on:click={() => creatingCollection = true}
                disabled={creatingCollection}
            >
                <Icon icon="fluent:collections-24-regular" width="20" height="20" />
            </button>
        </div>
        <div class="flex flex-col gap-2">
            {#if creatingCollection}
                <BookCreateCollection
                    onCancel={onCancelCollectionCreation}
                    onCreate={onCreateCollection}
                />
            {/if}
            {#each bookCollections as collection}
                <BookCollection
                    collection={collection}
                    onDelete={() => onDeleteBookCollection(collection)}
                />
            {/each}
        </div>
    {/if}
</div>
