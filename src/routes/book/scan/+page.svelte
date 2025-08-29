<script lang="ts">
    import { page } from "$app/state"
    import { getDevicesInfo, type VideoDeviceInfo } from "$lib/components/book-scan/devices"
    import { setFlashState, isFlashAvailable } from "$lib/components/book-scan/FlashToggler"
    import IsbnScanner from "$lib/components/book-scan/ISBNScanner.svelte"
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte"
    import TextInputField from "$lib/components/form/TextInputField.svelte"
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import HttpCodes from "$lib/utils/http-codes"
    import { hasPermissions } from "$lib/utils/permissions"
    import { formISBNRegex, validateISBN } from "$lib/validation/book/isbn"
    import Quagga from "@ericblade/quagga2"
    import Icon from "@iconify/svelte"
    import { getModalStore, getToastStore, RadioGroup, RadioItem, SlideToggle } from "@skeletonlabs/skeleton"
    import { onMount } from "svelte"
    import type { PageData } from "./$types";
    import type { BookCreate, EditionCreate, ScanPage } from "$lib/types";
    import ButtonWithSpinner from "$lib/components/ButtonWithSpinner.svelte";
    import { goto } from "$app/navigation";
    import LoadingModal from "$lib/components/book-scan/LoadingModal.svelte";
    import BookSelectionModal from "$lib/components/book-scan/BookSelectionModal.svelte";
    import BookEditionImage from "$lib/components/BookEditionImage.svelte";
    import PlaceholderImage from "$lib/components/PlaceholderImage.svelte";
    import urls from "$lib/urls";


    let { data }: {
        data: PageData
    } = $props()

    const modalStore = getModalStore()
    const toastStore = getToastStore()
    const errorToast = (message: string) => toastStore.trigger({
        message,
        background: "variant-filled-error"
    })

    const editionSelectionModal = () => modalStore.trigger({
        type: "component",
        component: {
            ref: BookSelectionModal,
            props: {
                books: data.books,
                selected: targetEdition
            }
        },
        response(response: ScanPage.BookWithEditions | "clear" | undefined | false) {
            if (!response) return
            if (response === "clear") {
                targetEdition = undefined
                return
            }
            targetEdition = response
        }
    })

    type ScannedEditions = {
        scannedAt: Date,
        isbn: string
    } & (
        { status: "created" } & (
            { type: "book", data: BookCreate.Type } |
            { type: "edition", data: EditionCreate.Type }
        )
        | { status: "duplicate", edition: ScanPage.DuplicateEdition }
        | { status: "not_found" }
    )

    let selectedInputOption = $state(0)
    let scanner = $state<IsbnScanner>()
    let scannedItems = $state<ScannedEditions[]>([])
    let devicesInfo = $state<VideoDeviceInfo[]>([])
    let cameraAvailable = $state(true)
    let flashAvailable = $state(false)
    let flash = $state(false)
    let continuos = $state(false)
    let loading = $state(false)
    let targetEdition = $state<ScanPage.BookWithEditions>()
    let infoCardState = $state(false)

    onMount(async () => {
        devicesInfo = await getDevicesInfo()

        const permission = await navigator.permissions.query({ name: "camera" })
        if (devicesInfo.length === 0 || permission.state === "denied") {
            cameraAvailable = false
        }
    })

    async function fetchBookData(isbn: string) {
        const response = await fetch(`/book/scan/${isbn}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                targetBookId: targetEdition?.id
            })
        })
        const json = await response.json()
        loading = false

        switch (response.status) {
            case HttpCodes.ClientError.BadRequest: {
                // Invalid ISBN
                isbnError = "Invalid ISBN"
                break
            }
            case HttpCodes.ServerError.InternalServerError: {
                errorToast("Internal Server Error")
                break
            }
            case HttpCodes.ClientError.Conflict: {
                // Edition already exists in db
                const duplicatedEdition = json as ScanPage.DuplicateEdition
                if (!continuos || selectedInputOption === 1) {
                    goto(urls.bookPage(duplicatedEdition.book.id, duplicatedEdition.id))
                }
                scannedItems.unshift({
                    status: "duplicate",
                    edition: duplicatedEdition,
                    scannedAt: new Date(),
                    isbn
                })
                break
            }
            case HttpCodes.ClientError.NotFound: {
                // Edition not found in external services
                if (!continuos || selectedInputOption === 1) {
                    resolveNotFound(isbn)
                    return
                }

                scannedItems.unshift({
                    status: "not_found",
                    isbn,
                    scannedAt: new Date()
                })
                break
            }

            case HttpCodes.Success.Created: {
                isbnError = ""

                if (!continuos || selectedInputOption === 1) {
                    if (!targetEdition) {
                        const book = json as BookCreate.Type
                        goto(urls.bookPage(book.id, book.editions[0].id))
                        return
                    }
                    const edition = json as EditionCreate.Type
                    const bookId = targetEdition.id
                    goto(urls.bookPage(bookId, edition.id))
                    return
                }

                if (!targetEdition) {
                    scannedItems.unshift({
                        status: "created",
                        type: "book",
                        data: json as BookCreate.Type,
                        scannedAt: new Date(),
                        isbn
                    })
                    return
                }

                scannedItems.unshift({
                    status: "created",
                    type: "edition",
                    data: json as EditionCreate.Type,
                    scannedAt: new Date(),
                    isbn
                })
                break
            }
        }
    }

    function resolveNotFound(isbn: string) {
        if (!targetEdition) {
            // Create new book and an edition with {isbn}
            goto(urls.bookCreate(isbn))
            return
        }

        // Create a new edition in {bookId} with {isbn}
        const bookId = targetEdition.id
        goto(urls.bookEdit(bookId, isbn))
    }

    async function onDetected(isbn: string) {
        if (!validateISBN(isbn)) return
        if (scannedItems.some(item => item.isbn === isbn)) return
        if (!continuos) {
            await Quagga.stop()
        }
        await fetchBookData(isbn)
    }

    async function afterCameraInit() {
        flashAvailable = await isFlashAvailable()
    }

    let manualISBN = $state("")
    let isbnError = $state("")
    function onManualLookUp() {
        if (!validateISBN(manualISBN)) {
            isbnError = "Invalid ISBN"
            return
        }
        loading = true
        onDetected(manualISBN)
    }

    function clearAllScannedResults() {
        scannedItems = []
    }

    function removeScannedResult(index: number) {
        scannedItems.splice(index, 1)
    }

    $effect(() => {
        if (loading && selectedInputOption === 0) {
            modalStore.trigger({
                type: "component",
                component: {
                    ref: LoadingModal,
                }
            })
        }
    })
</script>

{#if page.data.user && hasPermissions(page.data.user.permissionGroup, ["Create Book"])}
    <div class="max-w-7xl mx-auto p-3 sm:p-6 flex flex-col gap-6">
        <h1 class="h1">Scan Books</h1>
        <div class="flex flex-col gap-6 sm:border border-surface-500 p-1 sm:p-6 rounded-container-token">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex gap-2">
                    <button class="btn variant-ghost-secondary md:w-fit w-full" onclick={() => editionSelectionModal()}>
                        <Icon icon="lucide:target" height="16" />
                        <span>{targetEdition?.editions[0]?.title || "Select Target Book"}</span>
                    </button>
                    <button class={[
                        "sm:hidden btn",
                        infoCardState ? "variant-filled-surface" : "variant-ghost-surface"
                    ]} onclick={() => infoCardState = !infoCardState}>
                        <Icon icon="mdi:info-outline" height="16" />
                        {#if infoCardState}
                            <Icon icon="tabler:caret-up-filled" height="16" />
                        {:else}
                            <Icon icon="tabler:caret-down-filled" height="16" />
                        {/if}
                    </button>
                </div>
                <div class={[
                    "items-center gap-2 p-4 card w-full",
                    infoCardState ? "flex" : "hidden sm:flex"
                ]}>
                    <Icon icon="mdi:info-outline" height="16" class="shrink-0" />
                    <span class="text-sm">Default behavior: Each scan creates a new book. Select a target book to add editions to an existing book.</span>
                </div>
            </div>
            <RadioGroup padding="py-2">
                <RadioItem bind:group={selectedInputOption} name="scan-mode" value={0} class="flex items-center justify-center gap-2">
                    <Icon icon="mdi:camera-outline" height="16" />
                    <span>Scan ISBN</span>
                </RadioItem>
                <RadioItem bind:group={selectedInputOption} name="enter-mode" value={1} class="flex items-center justify-center gap-2">
                    <Icon icon="mdi:book-open-blank-variant-outline" height="16" />
                    <span>Enter ISBN</span>
                </RadioItem>
            </RadioGroup>

            {#if selectedInputOption === 0}
                {#if cameraAvailable}
                    <div class={[
                        "flex flex-col *:w-full gap-4 sm:grid",
                        flashAvailable === devicesInfo.length > 1
                            ? "sm:grid-cols-3"
                            : "sm:grid-cols-2"
                    ]}>
                        <div class="flex gap-2 items-center justify-between px-4 py-3 rounded-sm shadow-sm variant-ghost-tertiary">
                            <div class={[
                                "rounded-full p-1",
                                {
                                    "bg-tertiary-900 text-tertiary-400": continuos,
                                    "bg-gray-100 text-gray-400": !continuos
                                }
                            ]}>
                                <Icon icon="lucide:refresh-cw" height="16" />
                            </div>
                            <span>Continuos Scanning</span>
                            <SlideToggle
                                name="continuos-scanning"
                                size="sm"
                                bind:checked={continuos}
                                active="bg-tertiary-500"
                            />
                        </div>
                        {#if flashAvailable}
                            <div class="flex gap-2 items-center justify-between px-4 py-3 rounded-sm shadow-sm variant-ghost-warning">
                                <div class={[
                                    "rounded-full p-1",
                                    {
                                        "bg-warning-900 text-warning-400": flash,
                                        "bg-gray-100 text-gray-400": !flash
                                    }
                                ]}>
                                {#if flash}
                                    <Icon icon="lucide:zap" height="16" />
                                {:else}
                                    <Icon icon="lucide:zap-off" height="16" />
                                {/if}
                                </div>
                                <span>Flash</span>
                                <SlideToggle
                                    name="continuos-scanning"
                                    size="sm"
                                    bind:checked={flash}
                                    active="bg-warning-500"
                                    onclick={() => setFlashState(flash)}
                                />
                            </div>
                        {/if}
                        {#if devicesInfo.length > 1 && scanner?.deviceIndex !== undefined}
                            <div class="flex gap-2 items-center justify-between px-4 py-2 rounded-sm shadow-sm variant-ghost-success">
                                <div class="rounded-full p-1 bg-success-900 text-success-400">
                                    <Icon icon="lucide:camera" height="16" />
                                </div>
                                <span>{devicesInfo[scanner.deviceIndex].label}</span>
                                <button
                                    type="button"
                                    class="btn btn-sm border border-success-700 rounded-md"
                                    onclick={scanner.switchCamera}
                                >Switch</button>
                            </div>
                        {/if}
                    </div>
                    <IsbnScanner
                        bind:this={scanner}
                        {devicesInfo}
                        {onDetected}
                        afterInit={afterCameraInit}
                        class="h-[70vh]"
                    />
                {:else}
                    <div class="flex flex-col gap-6 items-center">
                        <p class="text-error-500">Camera not available or permission denied</p>
                        <button
                            type="button"
                            class="btn variant-filled-primary w-fit"
                            onclick={() => { selectedInputOption = 1 }}
                        >Switch to Manual Entry</button>
                    </div>
                {/if}
            {:else}
                <ErrorMessage errors={[isbnError]}>
                    <TextInputField
                        text="ISBN"
                        name="isbn"
                        allowedRegex={formISBNRegex}
                        placeholder="9780123456789"
                        required
                        bind:value={manualISBN}
                    />
                </ErrorMessage>
                <ButtonWithSpinner class="variant-ghost-primary" {loading} onclick={() => onManualLookUp()}>
                    Look Up Edition
                </ButtonWithSpinner>
            {/if}
        </div>

        {#if selectedInputOption === 0 && continuos}
            <div class="flex flex-col gap-3 sm:gap-6 sm:border border-surface-500 p-1 sm:p-6 rounded-container-token">
                <div class="flex justify-between">
                    <h3 class="h3">Scanned Editions</h3>
                    <button type="button" class="btn btn-sm sm:btn-base hover:variant-soft duration-300" onclick={() => clearAllScannedResults()}>
                        <Icon icon="mdi:trash" height="24" class="mr-1" />
                        <span>Clear All</span>
                    </button>
                </div>
                {#each scannedItems as item, index}
                    <div class="flex p-2 sm:p-4 bg-surface-600 gap-4">
                        <div class="h-20 sm:h-40 *:h-full flex-shrink-0">
                            {#if item.status === "created"}
                                {#if item.type === "book"}
                                    <BookEditionImage
                                        bookId={item.data.id}
                                        editionId={item.data.editions[0].id}
                                        heights={item.data.editions[0].image}
                                    />
                                {:else}
                                    <BookEditionImage
                                        bookId={item.data.book.id}
                                        editionId={item.data.id}
                                        heights={item.data.image}
                                    />
                                {/if}
                            {:else if item.status === "duplicate"}
                                <BookEditionImage
                                    bookId={item.edition.book.id}
                                    editionId={item.edition.id}
                                    heights={item.edition.image}
                                />
                            {:else if item.status === "not_found"}
                                <PlaceholderImage />
                            {/if}
                        </div>
                        <div class="grow flex flex-col justify-between">
                            <div class="flex flex-col gap-2">
                                {#if item.status === "created"}
                                    <div class="flex gap-4 items-center">
                                        {#if item.type === "book"}
                                            <a
                                                class="text-sm sm:text-base font-bold anchor w-min sm:w-auto"
                                                href="/book/{item.data.id}/{item.data.editions[0].id}"
                                            >{item.data.editions[0].title}</a>
                                        {:else}
                                            <a
                                                class="text-sm sm:text-base font-bold anchor w-min sm:w-auto"
                                                href="/book/{item.data.book.id}/{item.data.id}"
                                            >{item.data.title}</a>
                                        {/if}
                                        <div class="flex items-center gap-1 variant-ghost-success w-fit px-3 py-1 rounded-full text-success-300">
                                            <Icon icon="lucide:circle-check" />
                                            <span class="text-xs sm:text-sm">Created</span>
                                        </div>
                                    </div>
                                    {#if item.type === "book"}
                                        <p class="hidden sm:block text-sm">{item.data.authors.join(", ")}</p>
                                    {:else}
                                        <p class="hidden sm:block text-sm">{item.data.book.authors.join(", ")}</p>
                                    {/if}
                                {:else if item.status === "duplicate"}
                                    <div class="flex gap-4 items-center">
                                        <a
                                            class="text-sm sm:text-base font-bold anchor w-min sm:w-auto"
                                            href="/book/{item.edition.book.id}/{item.edition.id}"
                                        >{item.edition.title}</a>
                                        <div class="flex items-center gap-1 variant-ghost-tertiary w-fit px-3 py-1 rounded-full text-tertiary-300">
                                            <Icon icon="lucide:book-copy" />
                                            <span class="text-xs sm:text-sm">Duplicate</span>
                                        </div>
                                    </div>
                                    <p class="hidden sm:block text-sm">{item.edition.book.authors.join(", ")}</p>
                                {:else if item.status === "not_found"}
                                    <div class="flex gap-4 items-center">
                                        <p class="text-sm sm:text-base font-bold">Unknown<span class="hidden sm:block">Edition</span></p>
                                        <div class="flex items-center gap-1 variant-ghost-error w-fit px-3 py-1 rounded-full text-error-300">
                                            <Icon icon="lucide:search-code" />
                                            <span class="text-xs sm:text-sm">Not Found</span>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                            <div class="flex flex-col gap-2">
                                {#if item.status === "duplicate"}
                                    <p class="text-xs sm:text-sm">Duplicate Edition</p>
                                {:else if item.status === "not_found"}
                                    <p class="text-xs sm:text-sm">Not Found in External Services</p>
                                {/if}
                                <div class="flex items-center gap-2 sm:gap-4">
                                    <div class="flex items-center gap-1">
                                        <Icon icon="mdi:barcode" />
                                        <p class="text-xs sm:text-sm">{item.isbn}</p>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon icon="mdi:clock" />
                                        <p class="text-xs sm:text-sm">{item.scannedAt.toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col-reverse sm:flex-row h-fit gap-2">
                            {#if item.status === "not_found"}
                                <button class="btn-icon btn-icon-sm sm:btn sm:w-auto sm:aspect-auto variant-ghost-primary rounded-sm" onclick={() => resolveNotFound(item.isbn)}>
                                    <Icon icon="mdi:plus" height="24" />
                                    <span class="hidden sm:block">Create</span>
                                </button>
                            {/if}
                            <button class="btn-icon btn-icon-sm sm:btn-icon-base" onclick={() => removeScannedResult(index)}>
                                <Icon icon="mdi:close" height="24"/>
                            </button>
                        </div>
                    </div>
                {:else}
                    <p class="text-sm text-surface-300">No editions scanned yet</p>
                {/each}
            </div>
        {/if}
    </div>
{:else}
    <NotLoggedIn />
{/if}
