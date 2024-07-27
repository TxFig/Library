<script lang="ts">
    import type { PageData } from "./$types"
    import { page } from "$app/stores";

    import type { PublishDate } from "@prisma/client";

    import Icon from "@iconify/svelte"
    import EditButton from "$lib/components/book-page/EditButton.svelte";
    import DeleteButton from "$lib/components/book-page/DeleteButton.svelte";
    import AddToCollectionButton from "$lib/components/book-page/AddToCollectionButton.svelte";
    import ReadingStateRadioGroup from "$lib/components/book-page/ReadingStateRadioGroup.svelte";
    import ChipArray from "$lib/components/book-page/ChipArray.svelte";


    export let data: PageData
    const { book, readingState } = data

    function formatDate(date: PublishDate): string {
        const day = date.day ? `${date.day.toString().padStart(2, "0")}/` : ""
        const month = date.month ? `${date.month.toString().padStart(2, "0")}/` : ""

        return `${day}${month}${date.year}`
    }
</script>

<div class="flex justify-center w-full p-6 pb-24 md:h-full">
    <div class="flex flex-col md:flex-row justify-center items-center md:gap-4 gap-2 w-11/12 md:w-4/5">
        {#if book.image.length > 0}
            <img src={`/images/${book.isbn}/${book.image[0].height}.webp`} alt={book.title} />
        {:else}
            <Icon icon="material-symbols:book-outline" color="#fbe7d1" width="150" class="mb-1"/>
        {/if}

        <div class="flex flex-col gap-4 md:gap-6 w-full md:w-fit">
            <div class="flex flex-col gap-1">
                <p class="text-center md:text-left text-2xl">{book.title}</p>
                {#if book.subtitle}
                    <p class="text-center md:text-left text-sm">{book.subtitle}</p>
                {/if}
            </div>

            {#if book.number_of_pages}
                <p>Number of Pages: {book.number_of_pages}</p>
            {/if}
            {#if book.publish_date}
                <p>Publish Date: {formatDate(book.publish_date)}</p>
            {/if}

            {#if book.authors.length > 0}
                <div class="space-y-2">
                    <p>Authors:</p>
                    <ChipArray
                        data={book.authors.map(author => author.name)}
                        href="/author"
                    />
                </div>
            {/if}
            {#if book.publishers.length > 0}
                <div class="space-y-2">
                    <p>Publishers:</p>
                    <ChipArray
                        data={book.publishers.map(publisher => publisher.name)}
                        href="/publisher"
                    />
                </div>
            {/if}
            {#if book.subjects.length > 0}
                <div class="space-y-2">
                    <p>Subjects:</p>
                    <ChipArray
                        data={book.subjects.map(subjects => subjects.value)}
                        variant="variant-ringed-secondary"
                    />
                </div>
            {/if}
            {#if book.location}
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:location" width="16" />
                    <p>Location: {book.location.value}</p>
                </div>
            {/if}
            {#if book.language}
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:language" width="16" />
                    <p>Language: {book.language.value}</p>
                </div>
            {/if}
            <div class="flex items-center gap-1">
                <Icon icon="material-symbols:barcode" width="16" />
                <p>ISBN: {book.isbn}</p>
            </div>
            {#if $page.data.user}
                <ReadingStateRadioGroup readingState={readingState} bookId={book.id} />
            {/if}
        </div>
    </div>
</div>

{#if $page.data.user}
    <div class="fixed left-0 bottom-0 w-screen h-20 px-6 bg-surface-900 border-t-2 border-surface-500-400-token bg-opacity-95">
        <div class="flex flex-row-reverse items-center h-full gap-4">
            <DeleteButton isbn={book.isbn} />
            <EditButton isbn={book.isbn} />
            <AddToCollectionButton isbn={book.isbn} />
        </div>
    </div>
{/if}
