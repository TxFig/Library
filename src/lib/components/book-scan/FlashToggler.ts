import Quagga from "@ericblade/quagga2"


export async function setFlashState(state: boolean): Promise<void> {
    try {
        if (state) {
            await Quagga.CameraAccess.enableTorch()
        } else {
            await Quagga.CameraAccess.disableTorch()
        }
    } catch {}
}

export async function isFlashAvailable(): Promise<boolean> {
    try {
        await Quagga.CameraAccess.disableTorch()
        return true
    } catch {
        return false
    }
}
