<script lang="ts">
    import { page } from "$app/stores";
    import Quagga from "@ericblade/quagga2"
    import type { QuaggaJSConfigObject } from "@ericblade/quagga2"
    import DeviceSwitcher from "./DeviceSwitcher.svelte";


    const generateQuaggaConfig: (deviceId?: string) => QuaggaJSConfigObject = (deviceId) => ({
        inputStream: {
            target: "#input-target",
            constraints: {
                deviceId
            }
        },
        decoder: {
            readers: ["ean_reader"],
        },
    })

    export let deviceId: string | undefined = undefined
    $: if (
        deviceId &&
        $page.data.user &&
        window.navigator.mediaDevices
    ) QuaggaInit(deviceId)

    export function QuaggaInit(deviceId: string): void {
        Quagga.stop()
        Quagga.init(
            generateQuaggaConfig(deviceId),
            QuaggaInitCallback
        )
    }

    function QuaggaInitCallback(err: any): void {
        if (err) {
            console.log("Error Initializing Quagga:", err)
            return
        }
        Quagga.start()

        /*
        const track = Quagga.CameraAccess.getActiveTrack()
        const capabilities = track?.getCapabilities()
        const maxWidth = capabilities?.width?.max
        const maxHeight = capabilities?.height?.max

        track?.applyConstraints({
            width: { ideal: maxWidth },
            height: { ideal: maxHeight }
        })
        */
    }

    type OnDetected = (isbn: string) => void | Promise<void>
    export let onDetected: OnDetected | undefined = undefined

    Quagga.onDetected(async (result) => {
        const isbn = result.codeResult.code
        if (isbn && onDetected) await onDetected(isbn)
    })

    let externalClasses: string = ""
    export { externalClasses as class }
</script>

<div id="input-target" class={`relative ${externalClasses}`}>
    <DeviceSwitcher bind:deviceSelectedId={deviceId}/>
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

    :global(#input-target > button) {
        position: absolute;
        bottom: 20%; right: 3%;
        z-index: 1;
    }
</style>
