<script lang="ts">
    import { page } from "$app/state"
    import Quagga from "@ericblade/quagga2"
    import type { QuaggaJSConfigObject, QuaggaJSResultObject } from "@ericblade/quagga2"
    import { onDestroy, type ComponentProps } from "svelte"
    import { type VideoDeviceInfo } from "./devices";
    import ResultLoadingToast from "./ResultLoadingToast.svelte";


    let {
        devicesInfo,
        onDetected = undefined,
        afterInit = undefined,
        class: externalClasses
    }: {
        devicesInfo: VideoDeviceInfo[]
        onDetected?: (isbn: string) => Promise<void>
        afterInit?: () => void | Promise<void>
        class?: string
    } = $props()


    let deviceIndex: number | undefined = $state()
    export { deviceIndex }
    const generateQuaggaConfig: () => QuaggaJSConfigObject = () => ({
        inputStream: {
            target: "#input-target",
            constraints: {
                deviceId: devicesInfo[deviceIndex!].deviceId,
                facingMode: { ideal: "environment" },
                width: devicesInfo[deviceIndex!].width,
                height: devicesInfo[deviceIndex!].height
            }
        },
        decoder: {
            readers: ["ean_reader"],
        },
        frequency: 10
    })

    function QuaggaInit(): void {
        Quagga.stop()
        Quagga.init(
            generateQuaggaConfig(),
            QuaggaInitCallback
        )
    }

    $effect(() => {
        if (page.data.user && window.navigator.mediaDevices && deviceIndex !== undefined)
            QuaggaInit()
    })

    function QuaggaInitCallback(err: any): void {
        if (err) {
            return
        }
        Quagga.start()
        afterInit?.()
    }

    let toasts: ComponentProps<typeof ResultLoadingToast>[] = $state([])
    let loadingISBNs = $derived(toasts.map(t => t.isbn))
    async function onDetect(result: QuaggaJSResultObject) {
        const isbn = result.codeResult.code
        if (!isbn || loadingISBNs.includes(isbn)) return
        if (onDetected) {
            const promise = onDetected(isbn)
            toasts.push({ isbn, promise })
        }
    }

    Quagga.onDetected(onDetect)

    onDestroy(async () => {
        await Quagga.stop()
        Quagga.offDetected(onDetect)
    })

    $effect(() => {
        if (devicesInfo.length > 0) {
            deviceIndex = 0
        }
        else if (devicesInfo.length > 1) {
            deviceIndex = 1
        }
        else {
            deviceIndex = undefined
        }
    })

    export function incrementIndex() {
        if (deviceIndex === undefined) return
        deviceIndex = (deviceIndex + 1) % devicesInfo.length
    }

    export const restart = () => deviceIndex && QuaggaInit()
    export const switchCamera = () => incrementIndex()

</script>

<div id="input-target" class="relative {externalClasses}">
    <div class="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col gap-2">
        {#each toasts as toast}
            <ResultLoadingToast {...toast} />
        {/each}
    </div>
</div>

<style>
    :global(#input-target > video, #input-target > canvas) {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    :global(#input-target > canvas) {
        position: absolute;
        top: 0; left: 0;
    }
</style>
