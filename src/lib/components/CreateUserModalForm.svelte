<script lang="ts">
	import type { SvelteComponent } from "svelte"
	import { getModalStore, getToastStore } from "@skeletonlabs/skeleton"
    import CreateUserForm from "./CreateUserForm.svelte"
    import HttpCodes from "$lib/utils/http-codes"
    import type { POSTReturnType } from "@api/user";
    import type { UserWithPermissionGroup } from "$lib/server/database/auth"

    export let parent: SvelteComponent;

	const modalStore = getModalStore()
    const toastStore = getToastStore()

    let formData = { email: "", username: "" }
	async function onFormSubmit(): Promise<void> {
        const user = await createUserFormSubmit(formData)
        if ($modalStore[0].response && user) {
            $modalStore[0].response(user)
            modalStore.close()
        }
	}

    async function createUserFormSubmit(data: { email: string, username: string }): Promise<UserWithPermissionGroup | undefined> {
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

        const json: POSTReturnType = await response.json()
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
		<CreateUserForm bind:formData={formData} />

        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create User</button>
        </footer>
	</div>
{/if}
