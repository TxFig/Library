<script lang="ts">
    import { page } from "$app/stores";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import { hasPermission } from "$lib/utils/permissions";
    import { TabAnchor, TabGroup } from "@skeletonlabs/skeleton";
</script>

{#if !$page.data.user || !hasPermission($page.data.user, "Admin")}
    <NotLoggedIn />
{:else}
    <div class="p-6">
        <p class="text-xl mb-4">Admin Page</p>
        <TabGroup>
            <TabAnchor
                href="/admin/users"
                selected={$page.url.pathname === "/admin/users"}
            >Users</TabAnchor>
            <TabAnchor
                href="/admin/permission-groups"
                selected={$page.url.pathname === "/admin/permission-groups"}
            >Permissions</TabAnchor>
            <TabAnchor
                href="/admin/logs"
                selected={$page.url.pathname === "/admin/logs"}
            >Logs</TabAnchor>
            <TabAnchor
                href="/admin/settings"
                selected={$page.url.pathname === "/admin/settings"}
            >App Settings</TabAnchor>
            <svelte:fragment slot="panel">
                <slot />
            </svelte:fragment>
        </TabGroup>
    </div>
{/if}
