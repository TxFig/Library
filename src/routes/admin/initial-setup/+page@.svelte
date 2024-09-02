<script lang="ts">
    import type { PageData } from "./$types"
    import { getToastStore } from "@skeletonlabs/skeleton";
    import { superForm } from "sveltekit-superforms";
    import TextInput from "$lib/components/form/TextInput.svelte";
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte";

    export let data: PageData
    const { providedAdminEmail } = data


    let successfulCreation = false
    const { enhance, form, errors } = superForm(data.form, {
        onUpdate({ form: { message } }) {
            if (!message) return
            toastStore.trigger({
                message: message.text,
                background: message.type === "error" ? "variant-filled-error" : "variant-filled-success"
            })
            if (message.type === "success") {
                successfulCreation = true
            }
        },
    })

    const toastStore = getToastStore()

</script>

<div class="flex flex-col gap-4 p-6">
    <p class="text-2xl mb-4">Admin Account Setup</p>
    {#if providedAdminEmail}
        <p>Confirmation email sent</p>
    {:else}
        <p class="text-xl">Create Admin User Form:</p>
        <form class="flex flex-col gap-4" method="post" use:enhance inert={successfulCreation}>
            <div>
                <TextInput text="Email" bind:value={$form.email} errors={$errors.email} placeholder="Enter email..." required name="email" />
                <ErrorMessage errors={$errors.email} />
            </div>
            <div>
                <TextInput text="Username" bind:value={$form.username} errors={$errors.username} placeholder="Enter username..." required name="username" />
                <ErrorMessage errors={$errors.username} />
            </div>
            <button class="btn variant-ghost-primary w-fit">Create Admin User</button>
        </form>
    {/if}
</div>
