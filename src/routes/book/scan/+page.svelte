<script lang="ts">
    import { onMount } from "svelte"
    import { SlideToggle, getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
    import Quagga from "@ericblade/quagga2"
    import { page } from "$app/stores"
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte"
    import { validateISBN } from "$lib/validation/isbn"
    import HttpCodes from "$lib/utils/http-codes"

    const modalStore = getModalStore()

    let cameraViewer: HTMLDivElement
    let displayISBN: string | undefined = undefined
    let mediaDevicesAvailable = true
    let flashMode = false

    const bookAlreadyExistsAlert: ModalSettings = {
        type: "confirm",
        title: "Book Already Exists in Library",
        buttonTextConfirm: "Go to Book page",
        response(confirm) {
            if (confirm) {
                window.location.href = `/book/${displayISBN}/`
            } else {
                initQuagga()
                displayISBN = ""
            }
        },
    }

    const bookNotAvailableInOpenLibraryAlert: ModalSettings = {
        type: "confirm",
        title: "Book Not Available in OpenLibrary",
        buttonTextConfirm: "Manually Add Book",
        response(confirm) {
            if (confirm) {
                window.location.href = `/book/create/?isbn=${displayISBN}`
            } else {
                initQuagga()
                displayISBN = ""
            }
        },
    }

    onMount(() => {
        if (!window.navigator.mediaDevices) {
            mediaDevicesAvailable = false
            return
        }

        if ($page.data.user) initQuagga()
    })

    function initQuagga() {
        Quagga.init({
            inputStream: {
                type: "LiveStream",
                target: cameraViewer,
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["ean_reader"],
            }
        },
        (err) => {
            if (err) {
                return
            }

            Quagga.start()
        })
    }


    Quagga.onDetected(async (result) => {
        if (result.codeResult.code) {
            displayISBN = result.codeResult.code

            Quagga.CameraAccess.disableTorch()
            Quagga.stop()

            if (validateISBN(result.codeResult.code)) {
                onISBNConfirmation()
            } else {
                initQuagga()
                displayISBN = ""
            }
        }
    })

    async function onISBNConfirmation() {
        const response = await fetch(`/book/scan/${displayISBN}`, { method: "post" })

        if (response.status == HttpCodes.ClientError.Conflict) {
            // Sometime popup gets remove (weird bug)
            setTimeout(() => {
                modalStore.trigger(bookAlreadyExistsAlert)
            }, 200)
        }
        else if (response.status == HttpCodes.ClientError.NotFound) {
            // Not available in OpenLibrary
            modalStore.trigger(bookNotAvailableInOpenLibraryAlert)
        }
        else { // Book Created
            window.location.href = `/book/${displayISBN}/`
        }
    }

    function toggleFlash() {
        if (flashMode) {
            Quagga.CameraAccess.disableTorch()
        } else {
            Quagga.CameraAccess.enableTorch()
        }
    }

</script>

{#if $page.data.user}
    <div class="flex flex-col justify-center items-center h-max space-y-4">
        {#if mediaDevicesAvailable}
            <SlideToggle
                name="camera-flash"
                bind:checked={flashMode}
                on:click={toggleFlash}
            >
                Camera Flash
            </SlideToggle>

            <div bind:this={cameraViewer} class="relative"></div>
            <style>
                canvas {
                    position: absolute;
                    top: 0%;
                }
            </style>

            {#if displayISBN}
                <h1 class="text-2xl text-center">ISBN Code: {displayISBN}</h1>
            {:else}
                <p>Scanning...</p>
            {/if}

        {:else}
            <h1 class="text-2xl text-center">Media devices not available</h1>
        {/if}
    </div>
{:else}
    <NotLoggedIn/>
{/if}
