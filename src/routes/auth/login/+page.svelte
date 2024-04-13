<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/stores"
    import { getToastStore } from "@skeletonlabs/skeleton";
    import type { SubmitFunction } from "./$types";


    const toastStore = getToastStore()

    const enhanceHandler: SubmitFunction = function({ formData }) {
        // TODO

        return ({ result }) => {
            if (result.type == "success" && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-success"
                })
            }
            else if (result.type == "failure" && result.data?.message) {
                toastStore.trigger({
                    message: result.data.message,
                    background: "variant-filled-error"
                })
            }
        }
    }

</script>

<div class="w-full h-full flex justify-center items-center">
    <form method="post" class="flex flex-col gap-8 w-1/3 justify-center" use:enhance={enhanceHandler}>
        <h1 class="text-2xl">Log In</h1>
        <label for="email" class="label">
            <span>Email<sup class="text-red-500">*</sup></span>
            <input
                type="email"
                name="email"
                class="input"
                placeholder="email@example.com"
                value={$page.url.searchParams.get("email")}
                required
            >
        </label>
        <button type="submit" class="btn variant-filled-primary">Send Email</button>
    </form>
</div>
