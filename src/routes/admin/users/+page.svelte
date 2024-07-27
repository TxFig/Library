<script lang="ts">
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte"
    import CreateUserButton from "$lib/components/admin/UsersTab/CreateUserButton.svelte";
    import EditUserButton from "$lib/components/admin/UsersTab/EditUserButton.svelte";
    import DeleteUserButton from "$lib/components/admin/UsersTab/DeleteUserButton.svelte";

    export let data: PageData
    let {
        users,
        allPermissionGroups,
        createForm,
        updateForm
    } = data
</script>

{#if users.length == 0}
    <p class="variant-outline-error w-fit p-2 flex gap-1">
        <Icon icon="material-symbols:error-outline" width="24" height="24"/>
        <span>Error getting users</span>
    </p>
{:else}
    <div class="flex flex-col gap-4">
        <div class="table-container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Permission Group</th>
                        <th class="w-16">Edit</th>
                        <th class="w-16">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user}
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.permissionGroup?.name ?? "---"}</td>
                            <td>
                                <EditUserButton
                                    bind:users={users}
                                    {allPermissionGroups}
                                    user={user}
                                    {updateForm}
                                />
                            </td>
                            <td>
                                <DeleteUserButton
                                    bind:users={users}
                                    user={user}
                                />
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <CreateUserButton
            bind:users={users}
            {allPermissionGroups}
            {createForm}
        />
    </div>
{/if}
