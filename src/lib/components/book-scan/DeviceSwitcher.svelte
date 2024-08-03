<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    let devices: MediaDeviceInfo[] = []
    let selectedIndex = 0
    export let deviceSelectedId: string | undefined = undefined
    $: deviceSelectedId = (devices && devices.length > 0) ?
        devices[selectedIndex].deviceId
    : undefined

    onMount(async () => {
        devices = (await navigator.mediaDevices.enumerateDevices())
            .filter((device) => device.kind === "videoinput")

        if (devices.length > 1) {
            selectedIndex = 1
        }
    })

    function incrementIndex() {
        selectedIndex = (selectedIndex + 1) % devices.length
    }
</script>

{#if devices && devices.length > 1}
    <button class="btn-icon variant-glass-secondary" on:click={incrementIndex}>
        <Icon icon="ic:baseline-flip-camera-android" width="32" height="32" />
    </button>
{/if}
