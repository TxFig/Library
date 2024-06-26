import Quagga from "@ericblade/quagga2"


export async function setState(state: boolean): Promise<void> {
    try {
        if (state) {
            await Quagga.CameraAccess.enableTorch()
        } else {
            await Quagga.CameraAccess.disableTorch()
        }
    } catch (err) {
        console.log(err)
    }
}

export default setState
