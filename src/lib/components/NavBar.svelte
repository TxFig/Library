<script lang="ts">
    import { AppBar, popup, type PopupSettings } from "@skeletonlabs/skeleton"
    import Icon from "@iconify/svelte"
    import { page } from "$app/state";
    import { hasPermission } from "$lib/utils/permissions";
    import { env } from "$env/dynamic/public";
    import urls from "$lib/urls";


    const authPopup: PopupSettings = {
        event: "click",
        target: "auth-popup",
        placement: "bottom-end",
        middleware: {
            offset: {
                mainAxis: 10,
                crossAxis: -15
            },
        }
    }
</script>

<AppBar class="border-b border-surface-600">
    <svelte:fragment slot="lead">
        <a class="btn variant-outline sm:ring-0" href="/">
            <Icon icon="clarity:library-line" width="24" height="24" />
            <span class="font-bold text-2xl hidden sm:block">Library</span>
        </a>
    </svelte:fragment>

    <svelte:fragment slot="trail">
        {#if page.data.user}
            <a class="btn variant-ghost-primary" href="/book/scan">
                <Icon icon="mdi:barcode-scan" width="24" height="24" />
                <span class="hidden sm:block">Scan Book</span>
            </a>
            <a class="btn variant-outline" href="/book/create">
                <Icon icon="mdi:book-plus-outline" width="24" height="24" />
                <span class="hidden sm:block">Create Book</span>
            </a>

            <div class="w-px h-10 bg-surface-600"></div>

            <button class="btn-icon variant-outline" use:popup={authPopup}>
                <Icon icon="material-symbols:person-sharp" width="32" height="32"/>
            </button>
            <div class="card p-4 shadow-md" data-popup="auth-popup">
                <div class="flex flex-col gap-2">
                    <p>{page.data.user.username}</p>
                    <a href="/user/{page.data.user.username}" class="btn variant-outline-secondary">
                        <Icon icon="material-symbols:person-sharp" height="24"/>
                        <span>Profile</span>
                    </a>
                    <a href="/settings" class="btn variant-outline-secondary">
                        <Icon icon="material-symbols:settings" height="24"/>
                        <span>Settings</span>
                    </a>
                    <a href={urls.dashboard.copies} class="btn variant-outline-secondary">
                        <Icon icon="mdi:book-outline" height="24"/>
                        <span>My Copies</span>
                    </a>
                    {#if hasPermission(page.data.user.permissionGroup, "Admin")}
                        <hr>
                        <a href="/admin/users" class="btn variant-outline-tertiary">
                            <Icon icon="eos-icons:admin-outlined" height="24"/>
                            <span>Admin Panel</span>
                        </a>
                    {/if}
                    <hr>
                    <a href="/auth/sign-out?{env.PUBLIC_REDIRECT_QUERY_KEY}={page.url.pathname}" class="btn variant-outline-error">
                        <Icon icon="ph:sign-out" height="24"/>
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
