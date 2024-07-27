<script lang="ts">
    import DeviceSelector from "$lib/components/book-scan/DeviceSelector.svelte";
    import ISBNScanner from "$lib/components/book-scan/ISBNScanner.svelte";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import ManualInsertISBN from "./ManualInsertISBN.svelte";
    import { validateISBN } from "$lib/validation/book/isbn";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import HttpCodes from "$lib/utils/http-codes";
    import { goto } from "$app/navigation"
    import Quagga from "@ericblade/quagga2";
    import LoadingModal from "./LoadingModal.svelte";


    let deviceId: string | undefined = undefined
    let ISBNScannerComponent: ISBNScanner

    const toastStore = getToastStore()
    const modalStore = getModalStore()

    const BookNotAvailableInOpenLibraryAlert: (isbn: string) => ModalSettings = (isbn) => ({
        type: "confirm",
        title: "Book Not Available in OpenLibrary",
        buttonTextConfirm: "Manually Add Book",
        response(confirm: boolean) {
            if (confirm) {
                window.location.href = `/book/create/?isbn=${isbn}`
            } else {
                if (ISBNScannerComponent && deviceId) {
                    ISBNScannerComponent.QuaggaInit(deviceId)
                }
            }
        },
    })

    const FetchingBookDataAlert: ModalSettings = {
        type: "component",
        component: {
            ref : LoadingModal
        }
    }

    async function fetchBookData(isbn: string) {
        const response = await fetch(`/book/scan/${isbn}`, { method: "post" })
        const json: {
            message: string
        } = await response.json()
        modalStore.close()
        fetchingBookData = false

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
            goto(`/book/${isbn}/`)
        }

        if (response.status === HttpCodes.ClientError.NotFound) {
            modalStore.trigger(
                BookNotAvailableInOpenLibraryAlert(isbn)
            )
        }
    }

    let fetchingBookData = false
    async function onDetected(isbn: string) {
        if (fetchingBookData) return
        if (!validateISBN(isbn)) {
            toastStore.trigger({
                message: "Invalid ISBN",
                background: "variant-filled-error",
            })
            return
        }

        fetchingBookData = true
        modalStore.trigger(FetchingBookDataAlert)
        await Quagga.stop()

        fetchBookData(isbn)
    }

    let mediaDevicesAvailable = true
    onMount(() => {
        if (!window.navigator.mediaDevices) {
            mediaDevicesAvailable = false
            return
        }
    })
</script>

{#if $page.data.user}
    {#if mediaDevicesAvailable}
        <div class="flex flex-col items-center h-full gap-4 p-6">
            <ISBNScanner {deviceId} class="h-5/6" {onDetected} bind:this={ISBNScannerComponent} />
            <DeviceSelector bind:deviceSelected={deviceId}/>
            <ManualInsertISBN onSubmit={onDetected}/>
        </div>
    {:else}
        <h1 class="text-2xl text-center">Media devices not available</h1>
    {/if}
{:else}
    <NotLoggedIn />
{/if}
