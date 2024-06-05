<script lang="ts">
    import { page } from "$app/stores"
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types";
    import CreateUserModalForm from "$lib/components/admin/CreateUserModalForm.svelte"
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import EditUserModalForm from "$lib/components/admin/EditUserModalForm.svelte";
    import HttpCodes from "$lib/utils/http-codes"
    import type { ResponseType } from "@api/user";
    import type { EntireUser } from "$lib/server/database/auth"


    export let data: PageData
    let { users, allPermissionGroups } = data

    const modalStore = getModalStore()
    const toastStore = getToastStore()

    const createUserModal: ModalSettings = {
        type: "component",
        component: {
            ref: CreateUserModalForm,
            props: { allPermissionGroups }
        },
        title: "Create User Form",
        response(user?: EntireUser) {
            if (user)
                users = [...users, user]
        }
    }

    function createUser() {
        modalStore.trigger(createUserModal)
    }

    const editUserModal: (user: EntireUser) => ModalSettings = (user) => ({
        type: "component",
        component: {
            ref: EditUserModalForm,
            props: { allPermissionGroups }
        },
        title: "Edit User Form",
        response(user: EntireUser) {
            users = users.map(u => u.id == user.id ? user : u)
        }
    })

    function editUser(user: EntireUser) {
        modalStore.trigger({
            type: "component",
            component: { ref: EditUserModalForm },
            title: "Edit User Form",
            response(user: EntireUser) {
                users = users.map(u => u.id == user.id ? user : u)
            }
        })
    }

    const deleteUserModal: (user: EntireUser) => ModalSettings = (user) => ({
        type: "confirm",
        title: "Delete User Confirmation",
        body: `Are you sure you want to delete the user <b>${user.username}</b>?`,
        async response(confirmed: boolean) {
            if (!confirmed) return
            const response = await fetch(`/api/user/${user.id}`, {
                method: "DELETE"
            })

            if (response.status == HttpCodes.Success) {
                users = users.filter(u => u.id != user.id)
            } else {
                const json: ResponseType = await response.json()
                toastStore.trigger({
                    message: json.message,
                    background: response.status == 200 ? "variant-filled-success" : "variant-filled-error"
                })
            }
        }
    })

    async function deleteUser(user: EntireUser) {
        modalStore.trigger(deleteUserModal(user))
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
