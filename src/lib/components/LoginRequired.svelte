<script lang="ts">
    import Icon from "@iconify/svelte";
    import TextInput from "./TextInput.svelte";
    import { getToastStore } from "@skeletonlabs/skeleton";
    import type { SubmitFunction } from "../../routes/auth/login/$types";
    import { EmailSchema } from "$lib/validation/utils";
    import { enhance } from "$app/forms";


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

<div class="flex items-center justify-center h-full">
    <div class="flex flex-col gap-12 p-6 sm:p-12 border border-surface-600 rounded-xl">
        <div class="flex items-center justify-center gap-2">
            <Icon icon="clarity:library-line" width="32" height="32" />
            <span class="font-bold text-3xl">Library</span>
        </div>

        <form
            class="space-y-8"
            action="/auth/login"
            method="POST"
            use:enhance={enhanceHandler}
        >
            <p class="text-2xl">Login</p>
            <div>
                <TextInput
                    text="Email"
                    type="email"
                    placeholder="Email..."
                    name="email"
                    required
                />
                {#if error}
                    <p class="text-red-600">{error}</p>
                {/if}
            </div>
            <button class="btn variant-filled-primary w-full">
                <Icon icon="ph:sign-in" width="24" height="24" />
                <span>Log In</span>
            </button>
        </form>
    </div>
</div>
