<script lang="ts">
    import { AppBar } from "@skeletonlabs/skeleton"
    import Icon from "@iconify/svelte"
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <a class="btn" href="/">
            <Icon icon="clarity:library-line" width="32" height="32" />
            <span class="font-bold text-2xl">Library</span>
        </a>
    </svelte:fragment>

    <svelte:fragment slot="trail">
        <div>
            <a class="btn variant-ghost-primary" href="/scan-book">
                <Icon icon="mdi:barcode-scan" width="24" height="24" />
                <span class="hidden sm:block">Scan Book</span>
            </a>
            <a class="btn" href="/create-book">
                <Icon icon="mdi:book-plus-outline" width="24" height="24" />
                <span class="hidden sm:block">Create Book</span>
            </a>
        </div>

    </svelte:fragment>
</AppBar>
