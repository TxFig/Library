<script lang="ts">
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte";
    import TextInput from "$lib/components/form/TextInput.svelte";
    import type { SuperFormCreateUser } from "$lib/server/api/user/POST";
    import type { EntireUser } from "$lib/server/database/auth/user";
    import type { PermissionGroup } from "@prisma/client";
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import { superForm, type FormResult } from "sveltekit-superforms";
    import type { ActionData } from "../../../../routes/admin/users/$types";
    import Combobox from "$lib/components/form/Combobox.svelte";


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
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label flex flex-col">
        <span>Permission Group <sup class="text-red-500">*</sup></span>
        <Combobox
            name="permissionGroup"
            bind:value={$form.permissionGroup}
            options={allPermissionGroups.map(permissionGroup => permissionGroup.name)}
        />
        <ErrorMessage errors={$errors.permissionGroup}/>
    </label>
</form>
