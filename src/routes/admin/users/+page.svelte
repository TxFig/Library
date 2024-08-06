<script lang="ts">
    import type { PageData } from "./$types";
    import Icon from "@iconify/svelte"
    import CreateUserButton from "$lib/components/admin/UsersTab/CreateUserButton.svelte";
    import EditUserButton from "$lib/components/admin/UsersTab/EditUserButton.svelte";
    import DeleteUserButton from "$lib/components/admin/UsersTab/DeleteUserButton.svelte";
    import { search } from "$lib/utils/search";

    export let data: PageData
    let {
        users,
        allPermissionGroups,
        createForm,
        updateForm
    } = data
    const allUsers = users

    let searchQuery: string = ""
    const searchKeys = ["email", "username"]
    function onQueryChange() {
        users = search(allUsers, searchQuery, {
            keys: searchKeys,
            threshold: 0.25,
            distance: 10,
            ignoreLocation: true,
        })
    }

</script>

<div class="flex flex-col gap-4">
    <div class="flex justify-end gap-4">
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">
                <Icon icon="material-symbols:search-rounded" width="24" height="24" />
            </div>
            <input
                type="search"
                placeholder="Search users..."
                bind:value={searchQuery}
                on:input={onQueryChange}
                class="[&::-webkit-search-cancel-button]:invert"
            />
        </div>
        <CreateUserButton
            bind:users={users}
            {allPermissionGroups}
            {createForm}
        />
    </div>
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
</div>
