export type VideoDeviceInfo = {
    deviceId: string,
    label: string,
    width?: number,
    height?: number
}

export async function getDevicesInfo(): Promise<VideoDeviceInfo[]> {
    if (!(navigator && navigator.mediaDevices)) return []

    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter((device) => device.kind === "videoinput")

    const devicesInfo: VideoDeviceInfo[] = []

    for (const device of videoDevices) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: device.deviceId } }
            })
            const track = stream.getVideoTracks()[0]
            const settings = track.getSettings()

            devicesInfo.push({
                deviceId: device.deviceId,
                label: device.label,
                width: settings.width,
                height: settings.height
            })

            track.stop()
        } catch {}
    }

    return devicesInfo
}
