<script lang="ts">
    import { page } from "$app/stores";
    import Quagga from "@ericblade/quagga2"
    import type { QuaggaJSConfigObject, QuaggaJSResultObject } from "@ericblade/quagga2"
    import DeviceSwitcher from "./DeviceSwitcher.svelte";
    import { onDestroy } from "svelte";




    const generateQuaggaConfig: (deviceId?: string) => QuaggaJSConfigObject = (deviceId) => ({
        inputStream: {
            target: "#input-target",
            constraints: {
                deviceId,
                facingMode: "environment",
                width: { ideal: 4096 },
                height: { ideal: 4096 }
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

    function QuaggaInit(deviceId: string): void {
        Quagga.stop()
        Quagga.init(
            generateQuaggaConfig(deviceId),
            QuaggaInitCallback
        )
    }

    export const Restart = () => deviceId && QuaggaInit(deviceId)

    function QuaggaInitCallback(err: any): void {
        if (err) {
            console.log("Error Initializing Quagga:", err)
            return
        }
        Quagga.start()
    }

    type OnDetected = (isbn: string) => void | Promise<void>
    export let onDetected: OnDetected | undefined = undefined

    async function onDetect(result: QuaggaJSResultObject) {
        const isbn = result.codeResult.code
        if (isbn && onDetected) {
            await onDetected(isbn)
        }
    }

    Quagga.onDetected(onDetect)

    onDestroy(async () => {
        await Quagga.stop()
        Quagga.offDetected(onDetect)
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
        bottom: 5%; right: 5%;
        z-index: 1;
    }
</style>
