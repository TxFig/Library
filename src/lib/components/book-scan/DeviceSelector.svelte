<script lang="ts">
    import { ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import { onMount } from "svelte"


    let devices: MediaDeviceInfo[]
    export let deviceSelected: string | undefined = undefined
    $: deviceLabel = deviceSelected ?
        devices.find((device) => device.deviceId === deviceSelected)?.label
    : "Select a Device"

    onMount(async () => {
        devices = await navigator.mediaDevices.enumerateDevices()
        devices = devices.filter((device) => device.kind === "videoinput")
        if (devices.length === 0) return

        deviceSelected = devices[0].deviceId
    })

    const devicePopup: PopupSettings = {
        event: "click",
        target: "devicePopup",
        placement: "bottom",
        closeQuery: ".listbox-item"
    }
</script>

{#if devices && devices.length !== 0}
    <button class="btn variant-filled w-64 justify-between" use:popup={devicePopup}>
        <span>{deviceLabel}</span>
        <span>↓</span>
    </button>
    <div class="card w-64 shadow-xl py-2" data-popup="devicePopup">
        <ListBox rounded="rounded-none">
            {#each devices as device}
                <ListBoxItem bind:group={deviceSelected} value={device.deviceId} name="deviceId">{device.label}</ListBoxItem>
            {/each}
        </ListBox>
        <div class="arrow bg-surface-100-800-token" />
    </div>
{/if}
