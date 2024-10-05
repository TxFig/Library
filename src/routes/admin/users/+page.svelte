<script lang="ts">
    import type { PageData } from "./$types";
    import CreateUserButton from "$lib/components/admin/UsersTab/CreateUserButton.svelte";
    import EditUserButton from "$lib/components/admin/UsersTab/EditUserButton.svelte";
    import DeleteUserButton from "$lib/components/admin/UsersTab/DeleteUserButton.svelte";
    import { type SearchOptions } from "$lib/utils/search";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import type { User } from "@prisma/client";

    export let data: PageData
    let {
        users,
        allPermissionGroups,
        createForm,
        updateForm
    } = data
    const allUsers = users

    const searchOptions: SearchOptions<User> = {
        keys: ["email", "username"]
    }
</script>

<div class="flex flex-col gap-4">
    <div class="flex justify-end gap-4">
        <SearchBar
            allValues={allUsers}
            bind:values={users}
            options={searchOptions}
            placeholder="Search users..."
        />
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
