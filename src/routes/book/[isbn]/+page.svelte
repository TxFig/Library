<script lang="ts">
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types"
    import { getModalStore, RadioGroup, type ModalSettings, RadioItem } from "@skeletonlabs/skeleton"
    import ImageDisplayer from "$lib/components/ImageDisplayer.svelte"
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    export let data: PageData
    const { book } = data

    const images = [
        book.front_image ? `/images/${book.front_image}` : null,
        book.back_image ? `/images/${book.back_image}` : null
    ].filter(Boolean) as string[]

    async function deleteBook() {
        await fetch(`/api/book/${book.isbn}`, { method: "DELETE" })
        window.location.href = "/"
    }

    const modalStore = getModalStore()
    const deletePopup: ModalSettings = {
        title: "Delete Confirmation",
        type: "confirm",
        response(confirm) {
            if (confirm) {
                deleteBook()
            }
        },

    }

    async function showPopupDeleteBook() {
        modalStore.trigger(deletePopup)
    }

    function redirectToEditPage() {
        goto(`/book/edit/${book.isbn}`)
    }

    let subjectLimit = 10
    let userState = 0
</script>

<div class="flex flex-col sm:flex-row justify-center items-center h-full pb-20 sm:gap-4">
    {#if book.front_image || book.back_image}
        <ImageDisplayer images={images} />
    {:else}
        <Icon icon="material-symbols:book-outline" color="#fbe7d1" width="150" class="mb-1"/>
    {/if}

    <div class="flex flex-col gap-4 w-full sm:w-fit">
        <div class="flex flex-col gap-1">
            <p class="text-center sm:text-left">{book.title}</p>
            {#if book.subtitle}
                <p class="text-center sm:text-left text-sm">{book.subtitle}</p>
            {/if}
        </div>

        {#if book.number_of_pages}
            <p>Number of Pages: {book.number_of_pages}</p>
        {/if}
        {#if book.publish_date}
            <p>Publish Date: {book.publish_date}</p>
        {/if}

        {#if book.authors.length != 0}
            <div class="space-y-2">
                <p>Authors:</p>
                <div class="flex gap-2 flex-wrap">
                    {#each book.authors as author}
                        <a class="chip variant-ringed-primary" href="/author/{author.name}">{author.name}</a>
                    {/each}
                </div>
            </div>
        {/if}
        {#if book.publishers.length != 0}
            <div class="space-y-2">
                <p>Publishers:</p>
                <div class="flex gap-2 flex-wrap">
                    {#each book.publishers as publisher}
                        <a class="chip variant-ringed-primary" href="/publisher/{publisher.name}">{publisher.name}</a>
                    {/each}
                </div>
            </div>
        {/if}
        {#if book.subjects.length != 0}
            <div class="space-y-2">
                <p>Subjects:</p>
                <div class="flex gap-2 flex-wrap">
                    {#each book.subjects.slice(0, subjectLimit) as subject}
                        <span class="chip variant-ringed-secondary px-4">{subject.value}</span>
                    {/each}
                    {#if book.subjects.length > subjectLimit}
                        <button class="chip variant-ringed-tertiary px-4" on:click={() => subjectLimit = Infinity}>More...</button>
                    {/if}
                </div>
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
            <div>
                <p>Reading State:</p>
                <RadioGroup class="flex flex-col">
                    <RadioItem bind:group={userState} name="userState" value={0} class="flex pl-5 items-center gap-2 pr-8">
                        <Icon icon="fa6-regular:eye-slash" width="16" height="16"/>
                        <span>Not Read</span>
                    </RadioItem>
                    <RadioItem bind:group={userState} name="userState" value={1} class="flex items-center gap-2 pr-8">
                        <Icon icon="fa6-regular:bookmark" width="16" height="16"/>
                        <span>Currently Reading</span>
                    </RadioItem>
                    <RadioItem bind:group={userState} name="userState" value={2} class="flex items-center gap-2 pr-8">
                        <Icon icon="fa6-regular:circle-check" width="16" height="16"/>
                        <span>Already Read</span>
                    </RadioItem>
                </RadioGroup>
            </div>
        {/if}
    </div>
</div>

{#if $page.data.user}
    <div class="fixed left-0 bottom-0 w-screen h-20 px-6 bg-surface-900 border-t-2 border-surface-500-400-token bg-opacity-95">
        <div class="flex flex-row-reverse items-center h-full gap-4">
            <button class="btn variant-ringed-error rounded-lg" on:click={showPopupDeleteBook}>
                <span>Delete</span>
                <Icon icon="ic:baseline-delete" width="24" />
            </button>
            <button class="btn variant-ringed-primary rounded-lg" on:click={redirectToEditPage}>
                <span>Edit</span>
                <Icon icon="material-symbols:edit" width="24" />
            </button>
        </div>
    </div>
{/if}
