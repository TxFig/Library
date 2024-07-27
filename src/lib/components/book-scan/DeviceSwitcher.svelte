<script lang="ts">
    import Icon from "@iconify/svelte";

    let devices: MediaDeviceInfo[] = []
    let selectedIndex = 0
    export let deviceSelectedId: string | undefined = undefined
    $: deviceSelectedId = (devices && devices.length !== 0) ?
        devices[selectedIndex].deviceId
    : undefined

    async function Init() {
        devices = (await navigator.mediaDevices.enumerateDevices())
            .filter((device) => device.kind === "videoinput")
    }

    function incrementIndex() {
        selectedIndex = (selectedIndex + 1) % devices.length
    }
</script>

<svelte:window on:load={Init} />

{#if devices && devices.length > 1}
    <button class="btn-icon variant-glass-secondary" on:click={incrementIndex}>
        <Icon icon="ic:baseline-flip-camera-android" width="32" height="32" />
    </button>
{/if}
