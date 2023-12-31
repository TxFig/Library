<script lang="ts">
    import { onMount } from "svelte"
    import { SlideToggle, getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
    import Quagga from "@ericblade/quagga2"

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
                window.location.href = `/create-book/?isbn=${displayISBN}`
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

        initQuagga()
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
                console.error(err)
                return
            }

            Quagga.start()
        })
    }

    function validateISBN(isbn: string): boolean {
        if (isbn.length != 10 && isbn.length != 13) return false

        // ISBN-10 validation
        if (isbn.length === 10) {
            let sum = 0
            for (let i = 0; i < 9; i++) {
                const digit = parseInt(isbn[i])
                if (isNaN(digit)) return false
                sum += digit * (10 - i)
            }
            let checkDigit = 10 - (sum % 10)
            let lastChar = isbn[9].toUpperCase()
            return checkDigit === 10 ? lastChar === 'X' : parseInt(lastChar) === checkDigit
        }
        // ISBN-13 validation
        else if (isbn.length === 13) {
            let sum = 0
            for (let i = 0; i < 12; i++) {
                const digit = parseInt(isbn[i])
                if (isNaN(digit)) return false
                sum += digit * (i % 2 === 0 ? 1 : 3)
            }
            const checkDigit = 10 - (sum % 10)
            const lastDigit = parseInt(isbn[12])
            return lastDigit === (checkDigit === 10 ? 0 : checkDigit)
        }

        return false
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
        const response = await fetch("/scan-book", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isbn: displayISBN }),
        })

        if (response.status == 409) {
            // Sometime popup gets remove (weird bug)
            setTimeout(() => {
                modalStore.trigger(bookAlreadyExistsAlert)
            }, 200)
        }
        else if (response.status == 404) {
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
