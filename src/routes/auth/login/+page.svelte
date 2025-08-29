<script lang="ts">
    import SuperDebug, { superForm } from "sveltekit-superforms"
    import type { PageData } from "./$types"
    import TextInputField from "$lib/components/form/TextInputField.svelte"
    import ErrorMessage from "$lib/components/form/ErrorMessage.svelte"
    import ButtonWithSpinner from "$lib/components/ButtonWithSpinner.svelte"
    import { valibotClient } from "sveltekit-superforms/adapters"
    import { LoginSchema } from "$lib/validation/auth/login"
    import { getToastStore } from "@skeletonlabs/skeleton";


    let { data }: { data: PageData } = $props()

    const toastStore = getToastStore()
    const { form, errors, enhance, delayed } = superForm(data.form, {
        validators: valibotClient(LoginSchema),
        delayMs: 100,

        onUpdate({ form }) {
            if (form.message) {
                toastStore.trigger({
                    message: form.message.text,
                    background: form.message.type == "success" ?
                        "variant-filled-success" : "variant-filled-error",
                })
            }
        },
    })

    let buttonWithSpinner: ButtonWithSpinner
    $effect(() => {
        buttonWithSpinner.loading = $delayed
    })
</script>

<div class="w-full h-full flex justify-center items-center">
    <form
        method="post"
        use:enhance
        class="flex flex-col gap-8 w-1/3 justify-center"
    >
        <h2 class="h2">Log In</h2>
        <ErrorMessage errors={$errors.email}>
            <TextInputField
                text="Email"
                name="email"
                placeholder="email@example.com"
                bind:value={$form.email}
                required
                type="email"
            />
        </ErrorMessage>
        <ButtonWithSpinner
            class="variant-filled-primary"
            type="submit"
            bind:this={buttonWithSpinner}
        >
            Send Email
        </ButtonWithSpinner>
    </form>
</div>
