<script lang="ts">
    import { page } from "$app/stores"
    import type { PageData } from "./$types";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import { Tab, TabGroup } from "@skeletonlabs/skeleton";
    import { hasPermission } from "$lib/utils/permissions";
    import UsersTab from "$lib/components/admin/tabs/UsersTab.svelte";
    import PermissionGroupsTab from "$lib/components/admin/tabs/PermissionGroupsTab.svelte";
    import ActivityLogTab from "$lib/components/admin/tabs/ActivityLogTab.svelte";


    export let data: PageData
    let { users, allPermissionGroups, allPermissions, entireActivityLog } = data

    let tabSet = 0
</script>

<p class="text-xl mb-4">Admin Page</p>

{#if !$page.data.user || !hasPermission($page.data.user, "Admin")}
    <NotLoggedIn/>
{:else}
    <TabGroup>
        <Tab bind:group={tabSet} name="users" value={0}>Users</Tab>
        <Tab bind:group={tabSet} name="permission-groups" value={1}>Permissions</Tab>
        <Tab bind:group={tabSet} name="activity" value={2}>Activity Log</Tab>
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <UsersTab {users} {allPermissionGroups}/>
            {:else if tabSet === 1}
                <PermissionGroupsTab permissionGroups={allPermissionGroups} permissions={allPermissions}/>
            {:else if tabSet === 2}
                <ActivityLogTab {entireActivityLog}/>
            {/if}
        </svelte:fragment>
    </TabGroup>
{/if}
