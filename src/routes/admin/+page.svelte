<script lang="ts">
    import { page } from "$app/stores"
    import Icon from "@iconify/svelte"
    import type { PageData } from "./$types";
    import CreateUserModalForm from "$lib/components/CreateUserModalForm.svelte"
    import { getModalStore, getToastStore, type ModalComponent, type ModalSettings } from "@skeletonlabs/skeleton";
    import type { User } from "@prisma/client";
    import NotLoggedIn from "$lib/components/NotLoggedIn.svelte";

    export let data: PageData
    let { users } = data

    const toastStore = getToastStore()

    const modalStore = getModalStore()
    const createUserModalComponent: ModalComponent = {
        ref: CreateUserModalForm
    }
    const createUserModal: ModalSettings = {
        type: "component",
        component: createUserModalComponent,
        title: "Create User Form",
        async response(r) {
            await createUserFormSubmit(r)
        },
    }

    async function createUserFormSubmit(data: { email: string, username: string }) {
        const response = await fetch("/api/user/", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                username: data.username
            })
        })

        const json: {
            status: 200,
            message: string,
            user: User
        } | {
            status: 500,
            message: string
        } = await response.json()

        if (json.status == 200) {
            users = [...users, json.user]
        }

        toastStore.trigger({
            message: json.message,
            background: json.status == 200 ? "variant-filled-success" : "variant-filled-error"
        })
    }

    function createUser() {
        modalStore.trigger(createUserModal)
    }

</script>

<div class="w-full h-full flex flex-col gap-4">
    <p class="text-xl">Admin Page</p>

    {#if !$page.data.user}
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
                        </tr>
                    </thead>
                    <tbody>
                        {#each users as user}
                            <tr>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
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
