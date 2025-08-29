<script lang="ts">
    import { page } from "$app/state";
    import Icon from "@iconify/svelte";
    import type { PageData } from "./$types";
    import BookEditionImage from "$lib/components/BookEditionImage.svelte";
    import RatingSelector from "$lib/components/book-page/RatingSelector.svelte";
    import ReadingStateRadioGroup from "$lib/components/book-page/ReadingStateRadioGroup.svelte";
    import Rating from "$lib/components/book-page/Rating.svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import { getModalStore, getToastStore, popup, type ModalSettings, type PopupSettings } from "@skeletonlabs/skeleton";
    import HttpCodes from "$lib/utils/http-codes";
    import { hasPermission } from "$lib/utils/permissions";
    import SubjectsModal from "$lib/components/book-page/SubjectsModal.svelte";
    import CreateCopyRequestModal from "$lib/components/book-page/CreateCopyRequestModal.svelte";
    import type { BookPage } from "$lib/types";
    import type { CopyRequestTransformed } from "$lib/server/database/interactions/copy"
    import { fetchAPI } from "$lib/utils/api-fetch";
    import type * as v from "valibot"
    import type { CopyRequestUpdateSchema } from "$lib/validation/interactions/copy";
    import ButtonWithSpinner from "$lib/components/ButtonWithSpinner.svelte";
    import urls from "$lib/urls";


    let { data }: { data: PageData } = $props()

    const modalStore = getModalStore()
    const toastStore = getToastStore()

    let subjectLimit = $state(4)

    let book = $state(data.book)
    let selectedEditionIndex = $state(data.selectedEditionIndex)
    let selectedEdition = $derived(book.editions[selectedEditionIndex])
    let ratings = $state(data.ratings)
    let readingStates = $state(data.readingStates)
    let showDetailsIndex: number | undefined = $derived(selectedEditionIndex)
    let subjects = $state(book.subjects)
    let copyRequests = $state(data.copyRequests)


    function updateSelectedEditionFromUrl() {
        const editionPublicId = page.url.searchParams.get("edition")
        const editionIndex = book.editions.findIndex(edition => edition.id === editionPublicId)
        if (editionIndex === -1) {
            goto(`?edition=${selectedEdition.id}`, {
                replaceState: true
            })
            return
        }
        selectedEditionIndex = editionIndex
    }
    afterNavigate(updateSelectedEditionFromUrl)

    function onEditionSelected(index: number) {
        selectedEditionIndex = index
        goto(`?edition=${selectedEdition.id}`)
    }

    function formatDate(date: { year: number, month?: number | null, day?: number | null }) {
        const day = date.day ? `${date.day.toString().padStart(2, "0")}/` : ""
        const month = date.month ? `${date.month.toString().padStart(2, "0")}/` : ""

        return `${day}${month}${date.year}`
    }

    const optionsPopup: PopupSettings = {
        event: "click",
        target: "optionsPopup",
        placement: "bottom-end",
    }

    async function deleteBook() {
        try {
            const response = await fetch(`/api/books/${book.id}`, { method: "DELETE" })

            if (!(response.status == HttpCodes.Success.OK)) {
                toastStore.trigger({
                    message: "Error Deleting Book",
                    background: "variant-filled-error"
                })
                return
            }

            toastStore.trigger({
                message: "Book Successfully Deleted",
                background: "variant-filled-success"
            })
            goto("/")
        } catch (err) {
            toastStore.trigger({
                message: "Error Deleting Book",
                background: "variant-filled-error"
            })
        }
    }
    const deleteConfirmationModal: ModalSettings = {
		type: "confirm",
		title: "Delete Confirmation",
		body: "Are you sure you wish to proceed?",
		response: (result: boolean | undefined) => {
            if (!result) return
            deleteBook()
        },
	}
    function triggerDeleteConfirmationModal() {
        modalStore.trigger(deleteConfirmationModal)
    }

    const subjectsModal = (subjs: string[]): ModalSettings => ({
        type: "component",
        component: {
            ref: SubjectsModal,
            props: {
                bookId: book.id,
                subjects: subjs
            }
        },
        response(deletedSubject: string | undefined | false) {
            if (!deletedSubject) return
            subjects = subjects.filter(subject => subject !== deletedSubject)
        },
    })
    function triggerSubjectsModal() {
        modalStore.trigger(subjectsModal(subjects))
    }

    const copyRequestModal: (editionIndex: number, copyIndex: number) => ModalSettings = (editionIndex, copyIndex) => ({
        type: "component",
        component: {
            ref: CreateCopyRequestModal,
            props: {
                bookId: book.id,
                edition: book.editions[editionIndex],
                copy: book.editions[editionIndex].copies[copyIndex]
            }
        },
        response(response: CopyRequestTransformed | "unavailable" | false | undefined) {
            if (!response) return
            if (response === "unavailable") {
                book.editions[editionIndex].copies[copyIndex].status = "unavailable"
                return
            }
            copyRequests[editionIndex][copyIndex] = response
        },
    })
    function triggerCopyRequestModal(editionIndex: number, copyIndex: number) {
        modalStore.trigger(copyRequestModal(editionIndex, copyIndex))
    }

    let cancellingRequest = $state(false)
    async function cancelCopyRequest(editionIndex: number, copyIndex: number) {
        cancellingRequest = true
        const request = copyRequests[editionIndex][copyIndex]
        if (!request) return
        const copy = book.editions[editionIndex].copies[copyIndex]
        const json = await fetchAPI(`/copies/${copy.id}/request/${request.id}`, {
            method: "PATCH",
            body: {
                status: "cancelled"
            } satisfies v.InferInput<CopyRequestUpdateSchema>
        })
        cancellingRequest = false
        if (json?.status === HttpCodes.Success.OK) {
            copyRequests[editionIndex][copyIndex] = undefined
        } else if (json?.status === HttpCodes.ClientError.BadRequest) {
            copyRequests[editionIndex][copyIndex] = undefined
        }
    }

    $effect(onResize)
    function onResize() {
        if (document.body.clientWidth > 640) {
            subjectLimit = 6
            return
        }
        subjectLimit = 4
    }
</script>

<svelte:window onresize={() => onResize()} />

<div class="space-y-4 md:space-y-8 px-4 py-6 sm:px-8 sm:py-10 max-w-7xl mx-auto">
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-3">
            <h1 class="h1 font-bold text-3xl">{selectedEdition.title}</h1>
            <p class="text-xl">
                {#each book.authors as author, index}
                    <a href="/?author={author}" title="Search by author" class="hover:anchor">
                        {author}
                    </a>{#if index !== book.authors.length - 1}
                        <span>,&nbsp;</span>
                    {/if}
                {/each}
            </p>
            <div class="flex gap-2 flex-wrap">
                {#each subjects.slice(0, subjectLimit) as subject}
                    <a class="chip variant-ghost-surface hover:anchor" href="/?subject={subject}" title="Search by subject">
                        {subject}
                    </a>
                {/each}
                {#if subjects.length > subjectLimit}
                    <p class="chip variant-ghost-surface cursor-default">...</p>
                {/if}
            </div>
        </div>
        <div class="flex justify-between">
            {#if subjects.length > subjectLimit}
                <button class="btn flex items-center gap-1 text-sm hover:variant-soft-surface w-fit px-3" onclick={() => triggerSubjectsModal()}>
                    <Icon icon="tabler:caret-down-filled" height="16" />
                    <span>Show all more subjects</span>
                </button>
            {/if}
            {#if page.data.user &&
                (hasPermission(page.data.user.permissionGroup, "Edit Book") || hasPermission(page.data.user.permissionGroup, "Delete Book"))
            }
                <button class="btn variant-outline-surface" use:popup={optionsPopup}>
                    <Icon icon="tabler:dots" height="16" />
                </button>
                <div class="card p-1 shadow-xl rounded-container-token" data-popup="optionsPopup">
                    <div class="arrow bg-surface-100-800-token"></div>
                    <div class="flex flex-col gap-1 items-start">
                        {#if hasPermission(page.data.user.permissionGroup, "Edit Book")}
                            <a class="btn" href="/book/{book.id}/edit?edition={selectedEdition.id}">
                                <Icon icon="mdi:edit" height="16" />
                                <span>Edit Book</span>
                            </a>
                        {/if}
                        {#if hasPermission(page.data.user.permissionGroup, "Delete Book")}
                            <button class="btn text-red-500" onclick={() => triggerDeleteConfirmationModal()}>
                                <Icon icon="mdi:trash" height="16" />
                                <span>Delete Book</span>
                            </button>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <div class="border-b border-surface-500"></div>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="flex flex-col gap-4 md:sticky md:top-8 md:h-fit">
            <BookEditionImage
                bookId={book.id}
                editionId={selectedEdition.id}
                heights={selectedEdition.image}
                quality="high"
                alt="{selectedEdition.title} Edition Image"
                class="border border-surface-500 h-60 max-h-[60vh] shrink-0 md:h-auto mx-auto"
                fetchpriority="high"
                loading="eager"
            />
            {#if page.data.user}
                <div class="flex flex-col gap-1">
                    <p class="opacity-70">Rate this edition</p>
                    <RatingSelector editionId={selectedEdition.id} bind:rating={ratings[selectedEditionIndex]} />
                    {#if ratings[selectedEditionIndex]}
                        <p class="text-center text-sm">You rated this edition {ratings[selectedEditionIndex]} stars</p>
                    {/if}
                </div>
                <div class="flex flex-col gap-1">
                    <p class="opacity-70">Reading Status</p>
                    <ReadingStateRadioGroup editionId={selectedEdition.id} bind:state={readingStates[selectedEditionIndex]} width="w-full" />
                </div>
            {/if}
        </div>
        <div class="space-y-4 w-full">
            <p class="text-2xl">Editions ({book.editions.length})</p>
            <div class="flex flex-col gap-4">
                {#each book.editions as edition, index}
                    {@render editionDisplay(edition, index)}
                {/each}
            </div>
        </div>
    </div>
</div>

{#snippet editionDisplay(edition: BookPage.DisplayEdition, editionIndex: number)}
    {@const ratingCount = edition.ratings.length + (ratings[editionIndex] ? 1 : 0)}
    {@const ratingSum = edition.ratings.reduce((rating, acc) => acc + rating, 0) + (ratings[editionIndex] ?? 0)}
    {@const averageRating = ratingSum / ratingCount}

    {#snippet info(classes: string = "")}
        <div class="flex flex-col gap-2 {classes}">
            <div class="flex gap-1 items-center">
                <Rating rating={averageRating} />
                {#if ratingCount > 0}
                    <p class="text-sm opacity-70">{averageRating}</p>
                {/if}
                <p class="text-sm opacity-70">({ratingCount} rating{ratingCount === 1 ? "" : "s"})</p>
            </div>
            <div class="flex gap-2 lg:gap-4">
                <div class="flex items-center gap-1">
                    <Icon icon="mdi:calendar" height="16" />
                    <a href="/?publish_year={edition.publishDate.year}" class="hover:anchor" title="Search by year">
                        {edition.publishDate.year}
                    </a>
                </div>
                {#if edition.language}
                    <div class="flex items-center gap-1">
                        <Icon icon="mdi:language" height="16" />
                        <a href="/?language={edition.language}" class="hover:anchor" title="Search by language">
                            {edition.language}
                        </a>
                    </div>
                {/if}
                {#if edition.pageCount}
                    <div class="flex items-center gap-1">
                        <Icon icon="mdi:book-open-blank-variant-outline" height="16" />
                        <span>{edition.pageCount} pages</span>
                    </div>
                {/if}
                {#if edition.copies.length > 0}
                    <div class="flex items-center gap-1">
                        <Icon icon="mdi:location" height="16" />
                        <span>{edition.copies.length} {edition.copies.length === 1 ? "copy" : "copies"}</span>
                    </div>
                {/if}
            </div>
        </div>
    {/snippet}
    {#snippet selectButton(classes: string = "")}
        {#if book.editions.length > 1}
            <div class="{classes} *:w-full">
                {#if editionIndex === selectedEditionIndex}
                    <p class="btn variant-filled">Selected</p>
                {:else}
                    <button class="btn variant-outline-surface inline-flex gap-2" onclick={() => onEditionSelected(editionIndex)}>
                        <Icon icon="ant-design:select-outlined" height="16" />
                        Select
                    </button>
                {/if}
            </div>
        {/if}
    {/snippet}

    <div class={[
        "flex flex-col gap-4 p-6 card card-hover transition-[transform,box-shadow]",
        { "border border-surface-300": editionIndex === selectedEditionIndex }
    ]}>
        <div class="flex gap-4">
            <BookEditionImage
                bookId={book.id}
                editionId={edition.id}
                heights={edition.image}
                alt="{edition.title} Edition Image"
                class="w-32 *:w-full border border-surface-500 shrink-0"
            />
            <div class="flex flex-col justify-between w-full">
                <div class="flex flex-col">
                    <p class="font-bold text-xl">{edition.title}</p>
                    {#if edition.subtitle}
                        <p>{edition.subtitle}</p>
                    {:else if edition.publishers.length > 0}
                        <p>{edition.publishers.join(", ")}</p>
                    {/if}
                </div>
                {@render info("hidden md:flex")}
            </div>
            {@render selectButton("hidden lg:block")}
        </div>
        {@render info("md:hidden")}
        <div class="flex gap-6 *:w-full">
            {#if showDetailsIndex !== editionIndex}
                <button class="btn variant-outline-surface lg:ring-0" onclick={() => showDetailsIndex = editionIndex}>
                    <Icon icon="clarity:details-line" height="16" />
                    <span>Show Details</span>
                </button>
            {:else}
                <button class="btn variant-outline-surface lg:ring-0" onclick={() => showDetailsIndex = undefined}>
                    Show Less
                </button>
            {/if}
            {@render selectButton("lg:hidden")}
        </div>
        {#if showDetailsIndex === editionIndex}
            <div class="border-b border-b-surface-300"></div>
            <div class="space-y-4">
                <div class="space-y-2">
                    <p>Publication Information</p>
                    <div class="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:*:w-1/2">
                        <div class="flex flex-col gap-4">
                            {#if edition.publishers.length > 0}
                                <div class="flex flex-col gap-1">
                                    <span class="opacity-70 text-sm">Publishers:</span>
                                    <div class="flex gap-2">
                                        {#each edition.publishers as publisher}
                                            <a class="chip variant-ghost-secondary hover:anchor" href="/?publisher={publisher}" title="Search by publisher">
                                                {publisher}
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            <div class="flex flex-col gap-1">
                                <span class="opacity-70 text-sm">ISBNs:</span>
                                {#if edition.isbn10}
                                    <p>ISBN-10: {edition.isbn10}</p>
                                {/if}
                                {#if edition.isbn13}
                                    <p>ISBN-13: {edition.isbn13}</p>
                                {/if}
                            </div>
                        </div>
                        <div class="flex flex-col gap-4">
                            {#if edition.authors.length > 0}
                                <div class="flex flex-col gap-1">
                                    <span class="opacity-70 text-sm">Additional Authors:</span>
                                    <div class="flex gap-2">
                                        {#each edition.authors as author}
                                            <a class="chip variant-ghost-secondary hover:anchor" href="/?author={author}" title="Search by author">
                                                {author}
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            <div class="flex flex-col gap-1">
                                <span class="opacity-70 text-sm">Publication Date:</span>
                                <span>{formatDate(edition.publishDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {#if edition.copies.length > 0}
                    <div class="space-y-2">
                        <p>Copies</p>
                        <div class="flex">
                            {#each edition.copies as copy, copyIndex}
                                {@render copyDisplay([edition, editionIndex], [copy, copyIndex])}
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/snippet}

{#snippet copyDisplay(
    [edition, editionIndex]: [BookPage.DisplayEdition, number],
    [copy, copyIndex]: [BookPage.DisplayCopy, number]
)}
    {@const loggedIn = page.data.user !== null}
    {@const request = copyRequests[editionIndex][copyIndex]}
    {@const requested = request !== undefined && request.status === "pending"}
    {@const owner = copy.owner.id === page.data.user?.id}

    <div class={[
        "card flex flex-col p-4 gap-4 w-full md:w-fit min-w-64 shadow-md",
        { "variant-ghost-tertiary": owner }
    ]}>
        <div class="flex gap-8 justify-between">
            <div class="flex gap-2">
                <Icon icon="mdi:location" height="24" />
                <div class="flex flex-col gap-2">
                    <a href="/?location={copy.location}" class="hover:anchor" title="Search by location">{copy.location}</a>
                    <div class="flex items-center gap-1">
                        <Icon icon="mdi:user" height="16" />
                        <a href="/user/{copy.owner.username}" class="hover:anchor">{copy.owner.username}</a>
                    </div>
                </div>
            </div>
            {#if loggedIn}
                {#if owner}
                    <div class="flex items-center gap-1 variant-ghost-tertiary w-fit px-3 py-1 rounded-full text-tertiary-300 h-fit">
                        <Icon icon="mdi:heart-outline" />
                        <span class="text-xs sm:text-sm">Owned</span>
                    </div>
                {:else if copy.status === "unavailable"}
                    <div class="flex items-center gap-1 variant-ghost-error w-fit px-3 py-1 rounded-full text-error-300 h-fit">
                        <Icon icon="mdi:block" />
                        <span class="text-xs sm:text-sm">Unavailable</span>
                    </div>
                {:else if copy.status === "on_loan"}
                    <div class="flex items-center gap-1 variant-ghost-warning w-fit px-3 py-1 rounded-full text-warning-300 h-fit">
                        <Icon icon="mdi:heart-outline" />
                        <span class="text-xs sm:text-sm">On Loan</span>
                    </div>
                {:else if requested}
                    <div class="flex items-center gap-1 variant-ghost-warning w-fit px-3 py-1 rounded-full text-warning-300 h-fit">
                        <Icon icon="mdi:hourglass" />
                        <span class="text-xs sm:text-sm">Requested</span>
                    </div>
                {:else}
                    <div class="flex items-center gap-1 variant-ghost-success w-fit px-3 py-1 rounded-full text-success-300 h-fit">
                        <Icon icon="lucide:circle-check" />
                        <span class="text-xs sm:text-sm">Available</span>
                    </div>
                {/if}
            {/if}
        </div>
        <div class="border-b border-b-surface-300"></div>
        {#if loggedIn}
            {#if owner}
                <a class="anchor text-center" href={urls.dashboard.copies}>
                    See in dashboard
                </a>
            {:else if requested}
                <div class="flex flex-col">
                    <p class="opacity-70">Pending owner response.</p>
                    <a href={urls.dashboard.requests} class="anchor mb-4">See in dashboard</a>
                    <ButtonWithSpinner
                        class="variant-filled-error"
                        contentClass="flex items-center gap-1"
                        onclick={() => cancelCopyRequest(editionIndex, copyIndex)}
                        loading={cancellingRequest}
                    >
                        <Icon icon="mdi:close" height="16" />
                        <span>Cancel Request</span>
                    </ButtonWithSpinner>
                </div>
            {:else if copy.status !== "unavailable" && copy.status !== "on_loan"}
                <button
                    class="btn btn-sm variant-outline-secondary w-fit"
                    onclick={() => triggerCopyRequestModal(editionIndex, copyIndex)}
                >Request Copy</button>
            {/if}
        {:else}
            <p class="text-warning-500/80">Login to request copy</p>
        {/if}
    </div>
{/snippet}
