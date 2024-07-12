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
</script>

<svelte:head>
    <title>Library</title>
</svelte:head>

<Modal />
<Toast />
<AppShell>
    <NavBar slot="header" />
    <div class="p-6 h-full">
        <slot />
    </div>
    <slot name="footer" />
</AppShell>
