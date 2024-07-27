<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/stores"
    import { getToastStore } from "@skeletonlabs/skeleton"
    import type { SubmitFunction } from "./$types"
    import { EmailSchema } from "$lib/validation/utils";
    import TextInput from "$lib/components/TextInput.svelte";


    const toastStore = getToastStore()

    let error: string | undefined = undefined
    const enhanceHandler: SubmitFunction = function({ formData, cancel }) {
        const data = formData.get("email")
        const parsingResult = EmailSchema.safeParse(data)
        if (!parsingResult.success) {
            error = parsingResult.error.errors[0].message
            cancel()
        }

        return ({ result }) => {
            if (result.type == "success" && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-success"
                })
            }
            else if (result.type == "failure") {
                error = result.data?.error

                if (result.data?.message) {
                    toastStore.trigger({
                        message: result.data.message,
                        background: "variant-filled-error"
                    })
                }
            }
        }
    }

</script>

<div class="w-full h-full flex justify-center items-center">
    <form method="post" class="flex flex-col gap-8 w-1/3 justify-center" use:enhance={enhanceHandler}>
        <h1 class="text-2xl">Log In</h1>
        <div>
            <TextInput
                text="Email"
                name="email"
                placeholder="email@example.com"
                value={$page.url.searchParams.get("email") ?? ""}
                required
            />
            {#if error}
                <p class="text-red-600">{error}</p>
            {/if}
        </div>
        <button type="submit" class="btn variant-filled-primary">Send Email</button>
    </form>
</div>
