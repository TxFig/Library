<script lang="ts">
    import Quagga from "@ericblade/quagga2"
    import type { QuaggaJSConfigObject } from "@ericblade/quagga2"


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
    $: if (deviceId) QuaggaInit(deviceId)

    function QuaggaInit(deviceId: string): void {
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

        const track = Quagga.CameraAccess.getActiveTrack()
        const capabilities = track?.getCapabilities()
        const maxWidth = capabilities?.width?.max
        const maxHeight = capabilities?.height?.max

        track?.applyConstraints({
            width: { ideal: maxWidth },
            height: { ideal: maxHeight }
        })

        drawScannerBorder()
    }

    function drawScannerBorder(): void {
        const drawingCtx = Quagga.canvas.ctx.overlay
        const drawingCanvas = Quagga.canvas.dom.overlay
        const width = drawingCanvas.width
        const height = drawingCanvas.height

        drawingCtx.clearRect(0, 0, width, height)

        drawingCtx.fillStyle = "red"
        drawingCtx.strokeStyle = "red"

        const rect = {
            width: width * 2/3,
            height: height / 6
        }
        const radius = width / 16

        drawingCtx.lineWidth = 5

        const corner = (xFactor: -1 | 1, yFactor: -1 | 1) => ({
            x: width / 2 + rect.width / 2 * xFactor,
            y: height / 2 + rect.height / 2 * yFactor,
        })

        const topleft = corner(-1, -1)
        drawingCtx.beginPath()
        drawingCtx.arc(topleft.x, topleft.y, radius, Math.PI, Math.PI * 3/2)
        drawingCtx.stroke()

        const topright = corner(1, -1)
        drawingCtx.beginPath()
        drawingCtx.arc(topright.x, topright.y, radius, Math.PI * 3/2, 0)
        drawingCtx.stroke()

        const bottomright = corner(1, 1)
        drawingCtx.beginPath()
        drawingCtx.arc(bottomright.x, bottomright.y, radius, 0, Math.PI / 2)
        drawingCtx.stroke()

        const bottomleft = corner(-1, 1)
        drawingCtx.beginPath()
        drawingCtx.arc(bottomleft.x, bottomleft.y, radius, Math.PI / 2, Math.PI)
        drawingCtx.stroke()
    }

    type OnDetected = (isbn: string) => void | Promise<void>
    export let onDetected: OnDetected | undefined = undefined

    Quagga.onDetected(async (result) => {
        const isbn = result.codeResult.code
        if (isbn && onDetected) await onDetected(isbn)
    })

    let externalClasses: string
    export { externalClasses as class }

</script>

<div id="input-target" class={`relative max-w-full max-h-full ${externalClasses}`}></div>

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
