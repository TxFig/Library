<script lang="ts">
    import { AppBar, popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import Icon from "@iconify/svelte"
    import { page } from "$app/stores";


    const authPopup: PopupSettings = {
        event: "click",
        target: "auth-popup",
        placement: "bottom",
        middleware: {
            offset: {
                mainAxis: 10,
                crossAxis: -70
            },
        }
    }

</script>

<AppBar>
    <svelte:fragment slot="lead">
        <a class="btn" href="/">
            <Icon icon="clarity:library-line" width="32" height="32" />
            <span class="font-bold text-2xl">Library</span>
        </a>
    </svelte:fragment>

    <svelte:fragment slot="trail">
        <a class="btn variant-ghost-primary" href="/scan-book">
            <Icon icon="mdi:barcode-scan" width="24" height="24" />
            <span class="hidden md:block">Scan Book</span>
        </a>
        <a class="btn variant-outline" href="/create-book">
            <Icon icon="mdi:book-plus-outline" width="24" height="24" />
            <span class="hidden md:block">Create Book</span>
        </a>

        <div class="w-[1px] h-10 bg-surface-600"></div>

        {#if $page.data.user}
            <button class="btn-icon variant-outline" use:popup={authPopup}>
                <Icon icon="material-symbols:person-sharp" width="32" height="32"/>
            </button>
            <div class="card p-4" data-popup="auth-popup">
                <div class="flex flex-col gap-4">
                    <p>{$page.data.user.username}</p>
                    <a href="/user/{$page.data.user.username}" class="btn variant-outline-secondary">
                        <Icon icon="material-symbols:person-sharp" width="24" height="24"/>
                        <span>Profile</span>
                    </a>
                    <a href="/auth/sign-out" class="btn variant-outline-secondary">
                        <Icon icon="ph:sign-out" width="24" height="24"/>
                        <span>Sign out</span>
                    </a>
                </div>
            </div>
        {:else}
            <a href="/auth/login" class="btn variant-filled">
                <Icon icon="ph:sign-in" width="24" height="24"/>
                <span class="hidden md:block">Log In</span>
            </a>
        {/if}


    </svelte:fragment>
</AppBar>
