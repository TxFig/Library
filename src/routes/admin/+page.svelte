<script lang="ts">
    import { page } from "$app/stores"
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types";
    import CreateUserModalForm from "$lib/components/CreateUserModalForm.svelte"
    import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";
    import type { UserWithPermissionGroup } from "$lib/server/database/auth"

    export let data: PageData
    let { users } = data


    const modalStore = getModalStore()
    const createUserModal: ModalSettings = {
        type: "component",
        component: { ref: CreateUserModalForm },
        title: "Create User Form",
        response(user: UserWithPermissionGroup) {
            console.log(user)
            users = [...users, user]
        }
    }

    function createUser() {
        modalStore.trigger(createUserModal)
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
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as user}
                            <tr>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.permissionGroup?.name ?? "---"}</td>
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
