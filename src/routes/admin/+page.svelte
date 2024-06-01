<script lang="ts">
    import { page } from "$app/stores"
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types";
    import CreateUserModalForm from "$lib/components/admin/CreateUserModalForm.svelte"
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import type { UserWithPermissionGroup } from "$lib/server/database/auth"
    import EditUserModalForm from "$lib/components/admin/EditUserModalForm.svelte";

    export let data: PageData
    let { users, permissionGroups } = data

    const modalStore = getModalStore()
    const createUserModal: ModalSettings = {
        type: "component",
        component: {
            ref: CreateUserModalForm,
            props: { permissionGroups }
        },
        title: "Create User Form",
        response(user: UserWithPermissionGroup) {
            users = [...users, user]
        }
    }

    function createUser() {
        modalStore.trigger(createUserModal)
    }

    function editUser(user: UserWithPermissionGroup) {
        modalStore.trigger({
            type: "component",
            component: { ref: EditUserModalForm },
            title: "Edit User Form",
            response(user: UserWithPermissionGroup) {
                users = users.map(u => u.id == user.id ? user : u)
            }
        })
    }

    function deleteUser(user: UserWithPermissionGroup) {
        // TODO: delete user from database
        users = users.filter(u => u.id != user.id)
    }

</script>

<div class="w-full h-full flex flex-col gap-4">
    <p class="text-xl">Admin Page</p>

    {#if !$page.data.user || !$page.data.user.admin}
        <NotLoggedIn/>
    {:else}
        {#if users.length == 0}
            <p class="variant-outline-error w-fit p-2 flex gap-1">
                <Icon icon="material-symbols:error-outline" width="24" height="24"/>
                <span>Error getting users</span>
            </p>
        {:else}
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
                                    <button on:click={() => editUser(user)}>
                                        <Icon icon="mdi:pencil" width="24" height="24"/>
                                    </button>
                                </td>
                                <td>
                                    <button on:click={() => deleteUser(user)}>
                                        <Icon icon="mdi:delete" width="24" height="24"/>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <button class="btn variant-outline-primary" on:click={createUser}>
                <Icon icon="mdi:user-add" width="24" height="24"/>
                <span>Create User</span>
            </button>
        {/if}
    {/if}
</div>
