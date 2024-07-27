<script lang="ts">
	import type { SvelteComponent } from "svelte"
	import { getModalStore } from "@skeletonlabs/skeleton"
    import UserForm from "./UserForm.svelte"
    import type { PermissionGroup } from "@prisma/client";
    import type { SuperFormCreateUser } from "$lib/server/api/user/POST";


    export let parent: SvelteComponent

    export let allPermissionGroups: PermissionGroup[]
    export let form: SuperFormCreateUser
    export let actionName: string
    export let opaqueId: string | undefined = undefined

	const modalStore = getModalStore()
    let submitForm: () => void
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
        <header class="text-2xl font-bold">{$modalStore[0].title}</header>
        <UserForm
            {allPermissionGroups}
            data={form}
            {actionName}
            bind:submitForm
            response={$modalStore[0].response}
            {opaqueId}
        />

        <footer class="modal-footer flex justify-end space-x-2">
            <button class="btn variant-ghost-surface" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn variant-filled" on:click={submitForm}>{parent.buttonTextConfirm}</button>
        </footer>
	</div>
{/if}
