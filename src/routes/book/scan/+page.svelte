<script lang="ts">
    import ISBNScanner from "$lib/components/book-scan/ISBNScanner.svelte";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import { page } from "$app/stores";
    import { onDestroy, onMount } from "svelte";
    import ManualInsertISBN from "./ManualInsertISBN.svelte";
    import { validateISBN } from "$lib/validation/book/isbn";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import HttpCodes from "$lib/utils/http-codes";
    import { goto } from "$app/navigation"
    import Quagga from "@ericblade/quagga2";
    import LoadingModal from "./LoadingModal.svelte";


    let ISBNScannerComponent: ISBNScanner

    const toastStore = getToastStore()
    const modalStore = getModalStore()

    const BookNotAvailableInExternalApis: (isbn: string) => ModalSettings = (isbn) => ({
        type: "confirm",
        title: "Book not available in external APIs.",
        buttonTextConfirm: "Manually Add Book",
        response(confirm: boolean) {
            if (confirm) {
                window.location.href = `/book/create/?isbn=${isbn}`
            } else {
                if (ISBNScannerComponent) {
                    ISBNScannerComponent.Restart()
                }
            }
        },
    })

    const FetchingBookDataAlert: ModalSettings = {
        type: "component",
        component: {
            ref: LoadingModal
        }
    }

    async function fetchBookData(isbn: string) {
        const response = await fetch(`/book/scan/${isbn}`, { method: "post" })
        const json: {
            message: string
        } = await response.json()
        modalStore.close()

        if (
            response.status === HttpCodes.ClientError.Conflict ||
            response.status === HttpCodes.ServerError.InternalServerError
        ) {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-error"
            })
        } else if (response.status === HttpCodes.Success) {
            toastStore.trigger({
                message: json.message,
                background: "variant-filled-success"
            })
        }

        if (
            response.status === HttpCodes.Success ||
            response.status === HttpCodes.ClientError.Conflict
        ) {
            await goto(`/book/${isbn}/`)
        }

        if (response.status === HttpCodes.ClientError.NotFound) {
            modalStore.trigger(
                BookNotAvailableInExternalApis(isbn)
            )
        }

        fetchingBookData = false
    }

    let fetchingBookData = false
    async function onDetected(isbn: string) {
        if (fetchingBookData || !validateISBN(isbn)) return
        fetchingBookData = true

        modalStore.trigger(FetchingBookDataAlert)
        await Quagga.stop()
        await fetchBookData(isbn)
    }

    let mediaDevicesAvailable = true
    onMount(() => {
        if (!window.navigator.mediaDevices) {
            mediaDevicesAvailable = false
            return
        }
    })

    onDestroy(async () => {
        await Quagga.stop()
    })
</script>

{#if $page.data.user}
    {#if mediaDevicesAvailable}
        <div class="flex flex-col items-center h-full gap-4 p-6">
            <ISBNScanner class="h-5/6" {onDetected} bind:this={ISBNScannerComponent} />
            <ManualInsertISBN onSubmit={onDetected}/>
        </div>
    {:else}
        <h1 class="text-2xl text-center">Media devices not available</h1>
    {/if}
{:else}
    <NotLoggedIn />
{/if}
