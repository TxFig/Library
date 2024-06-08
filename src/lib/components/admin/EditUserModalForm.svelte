<script lang="ts">
	import type { SvelteComponent } from "svelte"
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton"
    import UserForm from "./UserForm.svelte"
    import HttpCodes from "$lib/utils/http-codes"
    import type { ResponseType } from "@api/user";
    import type { EntireUser } from "$lib/server/database/auth/user";
    import type { PermissionGroup } from "@prisma/client";
    import type { UserUpdateData } from "$lib/validation/auth/user";


    export let parent: SvelteComponent

    export let allPermissionGroups: PermissionGroup[]
    export let user: EntireUser

	const modalStore = getModalStore()
    const toastStore = getToastStore()

    let formData = {
        email: user.email,
        username: user.username,
        permissionGroup: user.permissionGroup.name
    }
	async function onFormSubmit(): Promise<void> {
        const editedUser = await updateUserFormSubmit(user.id, formData)
        if ($modalStore[0].response && editedUser) {
            $modalStore[0].response(editedUser)
            modalStore.close()
        }
	}

    async function updateUserFormSubmit(userId: number, data: UserUpdateData): Promise<EntireUser | undefined> {
        const response = await fetch(`/api/user/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...data })
        })

        const json: ResponseType = await response.json()
        if (response.status == HttpCodes.Success) {
            return json.user
        }

        toastStore.trigger({
            message: json.message,
            background: response.status == 200 ? "variant-filled-success" : "variant-filled-error"
        })
    }
</script>


{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<header class="text-2xl font-bold">{$modalStore[0].title}</header>
		<UserForm bind:formData={formData} {allPermissionGroups}/>

        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Edit User</button>
        </footer>
	</div>
{/if}
