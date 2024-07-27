<script lang="ts">
    import "../app.postcss"
    import { Modal, Toast, AppShell } from "@skeletonlabs/skeleton"
    import NavBar from "$lib/components/NavBar.svelte"

    import { initializeStores } from "@skeletonlabs/skeleton"
    initializeStores()

    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom"
    import { storePopup } from "@skeletonlabs/skeleton"
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

    import { afterNavigate } from "$app/navigation"
    afterNavigate((params: any) => {
        const isNewPage: boolean =
            params.from &&
            params.to &&
            params.from.route.id !== params.to.route.id
        const elemPage = document.querySelector("#page")
        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0
        }
    })

    import type { LayoutData } from "./$types";
    import LoginRequired from "$lib/components/LoginRequired.svelte";
    export let data: LayoutData
</script>

<svelte:head>
    <title>Library</title>
</svelte:head>

<Modal />
<Toast zIndex="z-[1000]" />
{#if data.publicAccess || data.user}
    <AppShell slotPageContent="h-full">
        <NavBar slot="header" />
        <slot />
    </AppShell>
{:else}
    <LoginRequired />
{/if}
