<script lang="ts">
    import "../app.postcss"
    import { Modal, Toast, AppShell } from "@skeletonlabs/skeleton"
    import NavBar from "$lib/components/NavBar.svelte"
    import LoginRequired from "$lib/components/LoginRequired.svelte";

    import { initializeStores } from "@skeletonlabs/skeleton"
    initializeStores()

    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
    import { storePopup } from "@skeletonlabs/skeleton"
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

    import type { LayoutData } from "./$types";
    export let data: LayoutData
</script>

<svelte:head>
    <title>Library</title>
</svelte:head>

<Modal />
<Toast zIndex="z-[1000]" position="br" />
{#if data.publicAccess || data.user}
    <AppShell slotPageContent="h-full">
        <NavBar slot="header" />
        <slot />
    </AppShell>
{:else}
    <LoginRequired />
{/if}
