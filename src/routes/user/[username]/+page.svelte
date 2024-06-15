<script lang="ts">
    import { ReadingState } from "@prisma/client";
    import type { ActionData, PageData, SubmitFunction } from "./$types";
    import Icon from "@iconify/svelte";
    import { type PopupSettings, popup, getToastStore } from "@skeletonlabs/skeleton";
    import { enhance } from "$app/forms";

    export let data: PageData
    const { pageUser, isCurrentUser } = data


    const toastStore = getToastStore()

    const booksReading = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READING)
        .map(readingState => readingState.book)
    const booksRead = pageUser.userBookReadingState
        .filter(readingState => readingState.state === ReadingState.READ)
        .map(readingState => readingState.book)

    const createNewCollectionPopup: PopupSettings = {
        event: "click",
        target: "CreateNewCollectionPopup",
        placement: "bottom"
    }

    let bookCollections = pageUser.bookCollections

    const handleCreateBookCollection: SubmitFunction = async ({ formData, cancel }) => {
        const name = formData.get("name")
        if (!name || typeof name !== "string") {
            toastStore.trigger({
                message: "Name is required",
                background: "variant-filled-error"
            })
            cancel()
        }

        return async ({ result, formElement }) => {
            if (result.type == "failure" && result.data) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-error"
                })
            }
            else if (result.type == "success" && result.data) {
                formElement.reset()
                bookCollections = [...bookCollections, result.data.createBookCollection]
            }
        }
    }
</script>

<p class="text-2xl">{pageUser.username}</p>
<p>{pageUser.permissionGroup.name}</p>

{#if isCurrentUser}
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

    <hr class="my-4" />
    <p class="text-xl">Private Collections</p>
    <button class="btn variant-outline-primary my-2" use:popup={createNewCollectionPopup}>
        <Icon icon="fluent:collections-24-regular" width="24" height="24" />
        <span>Create New Collection</span>
    </button>
    <div class="card p-4 variant-ghost-primary" data-popup="CreateNewCollectionPopup">
        <div class="arrow variant-filled-primary" />
        <form action="?/create-book-collection" class="flex flex-col gap-2" method="post" use:enhance={handleCreateBookCollection}>
            <p>Name:</p>
            <input type="text" class="input" name="name" placeholder="My new collection..." />
            <button class="btn variant-ghost-secondary" type="submit">
                <Icon icon="material-symbols:add" width="24" height="24" />
                <span>Create</span>
            </button>
        </form>
    </div>
    {#each bookCollections as bookCollection}
        <p>{bookCollection.name}</p>
        <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4">
            {#each bookCollection.books as book}
                <a href={`/book/${book.isbn}`} class="snap-start shrink-0 card py-12 w-24 text-center">{book.title}</a>
            {/each}
            <button class="snap-start shrink-0 card py-12 w-24 btn">
                <Icon icon="material-symbols:add" width="24" height="24" class="mx-auto" />
            </button>
        </div>
    {/each}
{/if}
