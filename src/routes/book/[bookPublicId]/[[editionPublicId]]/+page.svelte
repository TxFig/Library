<script lang="ts">
    import type { PageData } from "./$types"
    import { page } from "$app/stores";

    import type { PublishDate } from "@prisma/client";

    import Icon from "@iconify/svelte"
    import EditButton from "$lib/components/book-page/EditButton.svelte";
    import DeleteButton from "$lib/components/book-page/DeleteButton.svelte";
    import CollectionsButton from "$lib/components/book-page/CollectionsButton.svelte";
    import ReadingStateRadioGroup from "$lib/components/book-page/ReadingStateRadioGroup.svelte";
    import RatingSelector from "$lib/components/book-page/RatingSelector.svelte";
    import NoCoverAvailable from "$lib/components/book-page/NoCoverAvailable.svelte";
    import Rating from "$lib/components/book-page/Rating.svelte";
    import Subjects from "$lib/components/book-page/Subjects.svelte";


    export let data: PageData
    const { book, readingState, rating, bookRating, numberOfRatings } = data

    function formatDate(date: PublishDate): string {
        const day = date.day ? `${date.day.toString().padStart(2, "0")}/` : ""
        const month = date.month ? `${date.month.toString().padStart(2, "0")}/` : ""

        return `${day}${month}${date.year}`
    }
</script>

<div class="flex flex-col md:flex-row w-full gap-4 md:gap-12 px-12 pt-12 pb-28 md:pb-12">
    <div class="flex flex-col gap-8 w-full md:w-1/3 lg:w-1/4 items-center">
        <div class="px-7">
            {#if data.book.image.length > 0}
                {@const largestImage = data.book.image.sort((a, b) => b.height - a.height)[0]}
                <img src={`/images/${book.isbn}/${largestImage.height}.webp`} alt={book.title} />
            {:else}
                <NoCoverAvailable isbn={book.isbn} />
            {/if}
        </div>
        {#if $page.data.user}
            <div class="hidden md:block space-y-4">
                <ReadingStateRadioGroup readingState={readingState} bookId={book.id} />
                <RatingSelector rating={rating} bookId={book.id} />
            </div>
        {/if}
    </div>
    <div class="flex flex-col gap-6 w-full md:w-2/3 lg:w-3/4">
        <div>
            <p class="text-3xl text-center md:text-left">{book.title}</p>
            {#if book.subtitle}
                <p class="text-xl opacity-80 text-center md:text-left">{book.subtitle}</p>
            {/if}
        </div>

        {#if $page.data.user}
            <div class="md:hidden flex flex-col items-center gap-2">
                <ReadingStateRadioGroup readingState={readingState} bookId={book.id} />
                <RatingSelector rating={rating} bookId={book.id} />
            </div>
        {/if}

        {#if book.authors.length > 0}
            <p class="text-xl">
                {#each book.authors as author, index}
                    {#if index !== 0}
                        <span>, </span>
                    {/if}
                    <a href="/author/{author.name}" class="hover:anchor duration-300">{author.name}</a>
                {/each}
            </p>
        {/if}

        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
                <Rating rating={bookRating} />
                {#if bookRating}
                    {@const roundedRating = Math.round(bookRating * 100) / 100}
                    <p class="text-xl">{roundedRating}</p>
                {:else}
                    <p class="text-xl">N/A</p>
                {/if}
            </div>
            <p class="text-sm opacity-80">{numberOfRatings} rating{numberOfRatings === 1 ? "" : "s"}</p>
        </div>

        <Subjects subjects={book.subjects} isbn={book.isbn} />

        {#if book.publishers.length > 0}
            <div>
                <p>Published by</p>
                <p>
                    {#each book.publishers as publisher, index}
                        {#if index !== 0}
                            <span>, </span>
                        {/if}
                        <a href="/publisher/{publisher.name}" class="hover:anchor duration-300">{publisher.name}</a>
                    {/each}
                </p>
            </div>
        {/if}

        <div class="flex flex-col gap-2">
            <p>Book Details</p>
            {#if book.number_of_pages}
                <p class="text-sm opacity-90">{book.number_of_pages} pages</p>
            {/if}
            {#if book.publish_date}
                <p class="text-sm opacity-90">First Published {formatDate(book.publish_date)}</p>
            {/if}
            {#if book.location}
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:location" width="16" />
                    <p class="text-sm opacity-90">Location: {book.location.value}</p>
                </div>
            {/if}
            {#if book.language}
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:language" width="16" />
                    <p class="text-sm opacity-90">Language: {book.language.value}</p>
                </div>
            {/if}
            <div class="flex items-center gap-1">
                <Icon icon="material-symbols:barcode" width="16" />
                <p class="text-sm opacity-90">ISBN: {book.isbn}</p>
            </div>
        </div>
    </div>
</div>

{#if $page.data.user}
    <div class="absolute left-0 bottom-0 w-screen h-20 px-6 bg-surface-900 border-t-2 border-surface-500 bg-opacity-95">
        <div class="flex flex-row-reverse items-center h-full gap-4">
            <DeleteButton isbn={book.isbn} />
            <EditButton isbn={book.isbn} />
            <CollectionsButton isbn={book.isbn} />
        </div>
    </div>
{/if}
