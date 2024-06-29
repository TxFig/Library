<script lang="ts">
    import { onMount } from "svelte"

    let devices: MediaDeviceInfo[]
    export let deviceSelected: string | undefined = undefined


    onMount(async () => {
        devices = await navigator.mediaDevices.enumerateDevices()
        devices = devices.filter((device) => device.kind === "videoinput")
        if (devices.length === 0) return

        deviceSelected = devices[0].deviceId
    })

</script>

{#if devices && devices.length !== 0}
    <select bind:value={deviceSelected}>
        {#each devices as device}
            <option value={device.deviceId}>{device.label}</option>
        {/each}
    </select>
{/if}
