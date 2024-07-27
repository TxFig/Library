<script lang="ts">
    import ErrorMessage from "$lib/components/book-form/ErrorMessage.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import type { SuperFormCreateUser } from "$lib/server/api/user/POST";
    import type { EntireUser } from "$lib/server/database/auth/user";
    import Icon from "@iconify/svelte";
    import type { PermissionGroup } from "@prisma/client";
    import { getModalStore, getToastStore, ListBox, ListBoxItem, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import { superForm, type FormResult } from "sveltekit-superforms";
    import type { ActionData } from "../../../../routes/admin/users/$types";


    export let data: SuperFormCreateUser
    export let actionName: string
    export let allPermissionGroups: PermissionGroup[]
    export let response: ((user: EntireUser) => void) | undefined = undefined
    export let opaqueId: string | undefined = undefined

    const toastStore = getToastStore()
    const modalStore = getModalStore()

    const { form, errors, enhance, submit } = superForm(data, {
        onUpdate({ result, form: { message } }) {
            if (message) {
                const variant = message.type === "success" ? "variant-filled-success" : "variant-filled-error"
                toastStore.trigger({
                    message: message.text,
                    background: variant
                })
            }

            const action: FormResult<ActionData> = result.data
            const user = action.data
            if (user && response) {
                response(user)
                modalStore.close()
            }
        },

        onSubmit(input) {
            if (opaqueId)
                input.formData.set("opaqueId", opaqueId)
        },

        onError({ result }) {
            toastStore.trigger({
                message: result.error.message,
                background: "variant-filled-error"
            })
        }
    })

    export const submitForm = submit

    const permissionGroupCombobox: PopupSettings = {
        event: "click",
        target: "permissionGroupCombobox",
        placement: "bottom",
        closeQuery: ".listbox-item",
    }
</script>

<form
    class="modal-form border border-surface-500 p-4 space-y-4 rounded-container-token"
    action="?/{actionName}"
    method="post"
    use:enhance
>
    <div>
        <TextInput
            text="Email"
            placeholder="Enter email..."
            bind:value={$form.email}
            errors={$errors.email}
            name="email"
            required
        />
        <ErrorMessage errors={$errors.email}/>
    </div>
    <div>
        <TextInput
            text="Username"
            placeholder="Enter username..."
            bind:value={$form.username}
            errors={$errors.username}
            name="username"
            required
        />
        <ErrorMessage errors={$errors.username}/>
    </div>
    <label class="label flex flex-col">
        <span>Permission Group <sup class="text-red-500">*</sup></span>
        <button class="btn variant-filled w-48 justify-between" use:popup={permissionGroupCombobox}>
            <span class="capitalize">{$form.permissionGroup || "Select"}</span>
            <Icon icon="tabler:caret-down-filled" width="24" height="24" />
        </button>
        <div class="card w-48 shadow-xl py-2" data-popup="permissionGroupCombobox">
            <ListBox rounded="rounded-container-token">
                {#each allPermissionGroups as permissionGroup}
                    <ListBoxItem
                        bind:group={$form.permissionGroup}
                        name="permissionGroup"
                        value={permissionGroup.name}
                    >{permissionGroup.name}</ListBoxItem>
                {/each}
            </ListBox>
            <div class="arrow bg-surface-100-800-token" />
        </div>
        <ErrorMessage errors={$errors.permissionGroup}/>
    </label>
</form>
