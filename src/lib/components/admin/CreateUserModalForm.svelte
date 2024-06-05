<script lang="ts">
	import type { SvelteComponent } from "svelte"
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton"
    import CreateUserForm from "./CreateUserForm.svelte"
    import HttpCodes from "$lib/utils/http-codes"
    import type { ResponseType } from "@api/user";
    import type { CreateUserInput, EntireUser } from "$lib/server/database/auth"
    import type { PermissionGroup } from "@prisma/client";

    export let parent: SvelteComponent

    export let allPermissionGroups: PermissionGroup[]

	const modalStore = getModalStore()
    const toastStore = getToastStore()

    let formData = {
        email: "",
        username: "",
        admin: false,
        permissionGroup: ""
    }
	async function onFormSubmit(): Promise<void> {
        const user = await createUserFormSubmit(formData)
        if ($modalStore[0].response && user) {
            $modalStore[0].response(user)
            modalStore.close()
        }
	}

    async function createUserFormSubmit(data: CreateUserInput): Promise<EntireUser | undefined> {
        const response = await fetch("/api/user/", {
            method: "post",
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
		<CreateUserForm bind:formData={formData} {allPermissionGroups}/>

        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create User</button>
        </footer>
	</div>
{/if}
