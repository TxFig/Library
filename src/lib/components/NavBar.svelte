<script lang="ts">
    import { AppBar, popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import Icon from "@iconify/svelte"
    import { page } from "$app/stores";
    import { hasPermission } from "$lib/utils/permissions";


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
        <a class="btn variant-outline sm:ring-0" href="/">
            <Icon icon="clarity:library-line" width="24" height="24" />
            <span class="font-bold text-2xl hidden sm:block">Library</span>
        </a>
    </svelte:fragment>

    <svelte:fragment slot="trail">
        <a class="btn variant-ghost-primary" href="/book/scan">
            <Icon icon="mdi:barcode-scan" width="24" height="24" />
            <span class="hidden sm:block">Scan Book</span>
        </a>
        <a class="btn variant-outline" href="/book/create">
            <Icon icon="mdi:book-plus-outline" width="24" height="24" />
            <span class="hidden sm:block">Create Book</span>
        </a>

        <div class="w-[1px] h-10 bg-surface-600"></div>

        {#if $page.data.user}
            <button class="btn-icon variant-outline" use:popup={authPopup}>
                <Icon icon="material-symbols:person-sharp" width="32" height="32"/>
            </button>
            <div class="card p-4" data-popup="auth-popup">
                <div class="flex flex-col gap-2">
                    <p>{$page.data.user.username}</p>
                    <a href="/user/{$page.data.user.username}" class="btn variant-outline-secondary">
                        <Icon icon="material-symbols:person-sharp" width="24" height="24"/>
                        <span>Profile</span>
                    </a>
                    <a href="/settings" class="btn variant-outline-secondary">
                        <Icon icon="material-symbols:settings" width="24" height="24"/>
                        <span>Settings</span>
                    </a>
                    {#if hasPermission($page.data.user, "Admin")}
                        <hr>
                        <a href="/admin" class="btn variant-outline-tertiary">
                            <Icon icon="eos-icons:admin-outlined" width="24" height="24"/>
                            <span>Admin Panel</span>
                        </a>
                    {/if}
                    <hr>
                    <a href="/auth/sign-out?redirectPath={$page.url.pathname}" class="btn variant-outline-error">
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
